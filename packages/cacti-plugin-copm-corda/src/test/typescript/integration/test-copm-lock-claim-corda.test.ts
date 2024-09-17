import "jest-extended";
import { AddressInfo } from "net";
import http from "http";
import { v4 as internalIpV4 } from "internal-ip";
import { v4 as uuidV4 } from "uuid";
import { createPromiseClient, PromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { createConnectTransport } from "@connectrpc/connect-node";
import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
  Servers,
} from "@hyperledger/cactus-common";
import {
  AuthorizationProtocol,
  ConfigService,
  ApiServer,
} from "@hyperledger/cactus-cmd-api-server";
//import { testApiSvrCfg } from "../lib/test-api-svr-cfg";
import { PluginCopmCorda } from "../../../main/typescript/plugin-copm-corda";
import { buildImageConnectorCordaServer } from "@hyperledger/cactus-test-tooling";
import {
  DefaultService,
  ClaimLockedAssetV1Request,
  LockAssetV1Request,
  DLAccount,
  AssetAccountV1PB,
} from "@hyperledger/cacti-copm-core";
import { CopmWeaverCordaTestnet } from "../lib/copm-weaver-corda-testnet";
import { TestAssets } from "../lib/test-assets";
import { TestCordaConnector } from "../lib/test-corda-connector";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const logLevel: LogLevelDesc = "DEBUG";
const log: Logger = LoggerProvider.getOrCreate({
  label: "plugin-copm-crpc-server-corda-test",
  level: logLevel,
});

describe("PluginCopmFabric", () => {
  let cordaTestnet: CopmWeaverCordaTestnet;
  let httpServer: http.Server;
  let apiServer: ApiServer;
  let assetManager: TestAssets;
  let client: PromiseClient<typeof DefaultService>;
  let user1: string, net1: string, user2: string, net2: string;
  let u1n1: DLAccount, u2n1: DLAccount;
  let u1n1PB: AssetAccountV1PB, u2n1PB: AssetAccountV1PB;
  let u1Connector: TestCordaConnector, u2Connector: TestCordaConnector;

  const hashSecret: string = "my_secret_123";
  const lockAssetName: string = "lockasset" + new Date().getTime().toString();

  beforeAll(async () => {
    httpServer = await Servers.startOnPreferredPort(4050);
    const addressInfoHttp = httpServer.address() as AddressInfo;
    //const apiHttpHost = `http://${addressInfoHttp.address}:${addressInfoHttp.port}`;
    //log.debug("HTTP API host: %s", apiHttpHost);
    cordaTestnet = new CopmWeaverCordaTestnet(log);

    /*
    const pluginRegistry = new PluginRegistry({ plugins: [] });


    const cordaPlugin = new PluginCopmCorda({
      instanceId: uuidV4(),
      logLevel,
      cordaConfig: cordaTestnet.cordaConfig,
      interopConfig: cordaTestnet.interopConfig,
      contractNames: cordaTestnet.contractNames,
    });

    pluginRegistry.add(cordaPlugin);

    const cfgSrv = new ConfigService();
    const apiSrvOpts = await cfgSrv.newExampleConfig();
    apiSrvOpts.authorizationProtocol = AuthorizationProtocol.NONE;
    apiSrvOpts.logLevel = logLevel;
    apiSrvOpts.configFile = "";
    apiSrvOpts.apiCorsDomainCsv = "*";
    apiSrvOpts.apiPort = addressInfoHttp.port;
    apiSrvOpts.cockpitPort = 0;
    apiSrvOpts.grpcPort = 0;
    apiSrvOpts.grpcMtlsEnabled = false;
    apiSrvOpts.apiTlsEnabled = false;
    apiSrvOpts.crpcPort = 0;
    const cfg = await cfgSrv.newExampleConfigConvict(apiSrvOpts);

    apiServer = new ApiServer({
      httpServerApi: httpServer,
      config: cfg.getProperties(),
      pluginRegistry,
    });

    log.info("staring api server");
    const { addressInfoGrpc, addressInfoCrpc } = await apiServer.start();
    const grpcPort = addressInfoGrpc.port;
    const grpcHost = addressInfoGrpc.address;
    const grpcFamily = addressInfoHttp.family;
    log.info("gRPC family=%s host=%s port=%s", grpcFamily, grpcHost, grpcPort);
    log.info("CRPC AddressInfo=%o", addressInfoCrpc);

    expect(apiServer).toBeTruthy();
*/
    [net1, net2] = cordaTestnet.networkNames();
    [user1, user2] = cordaTestnet.userNames();
    //   assetManager = cordaTestnet.assets();

    u1n1 = { organization: net1, userId: user1 };
    u2n1 = { organization: net1, userId: user2 };

    /*
    await buildImageConnectorCordaServer({
      logLevel,
    });
    */
    const internalIpOrUndefined = await internalIpV4();
    expect(internalIpOrUndefined).toBeTruthy();
    if (!internalIpOrUndefined) {
      throw Error("internal ip not defined");
    }

    /*

    u1Connector = new TestCordaConnector(
      "clientUser1",
      "test",
      internalIpOrUndefined,
      10006,
      log,
    );
    u2Connector = new TestCordaConnector(
      "clientUser1",
      "test",
      internalIpOrUndefined,
      10009,
      log,
    );

    */
    log.info("starting connector 1");

    /*
    cordaTestnet.addTestUser(u1n1, await u1Connector.start());
    log.info("starting connector 2");

    cordaTestnet.addTestUser(u2n1, await u2Connector.start());
    */
    const cordaServerPort = 9090;

    /*
    const transport = createConnectTransport({
      baseUrl: `http://${addressInfoHttp.address}:${cordaServerPort}`,
      httpVersion: "1.1",
    });
    */

    const transport = createGrpcTransport({
      // Requests will be made to <baseUrl>/<package>.<service>/method
      baseUrl: `http://${addressInfoHttp.address}:${cordaServerPort}`,
      httpVersion: "2",
    });

    client = createPromiseClient(DefaultService, transport);
    log.info("test setup complete");
  });

  afterAll(async () => {
    if (apiServer) {
      await apiServer.shutdown();
    }
    if (u1Connector) {
      await u1Connector.stop();
    }
    if (u2Connector) {
      await u2Connector.stop();
    }
  });

  /*
  test("corda-corda can lock/claim nft on same network by asset agreement", async () => {
    const assetType = "bond";

    const sourceCert = await cordaTestnet.getCertificateString({
      organization: net1,
      userId: user1,
    });
    const destCert = await cordaTestnet.getCertificateString({
      organization: net1,
      userId: user2,
    });

    await assetManager.addNonFungibleAsset(assetType, lockAssetName, {
      organization: net1,
      userId: user1,
    });

    const lockResult = await client.lockAssetV1(
      new LockAssetV1Request({
        assetLockV1PB: {
          asset: {
            assetType: assetType,
            assetId: lockAssetName,
          },
          owner: {
            network: net1,
            userId: user1,
          },
          hashInfo: {
            secret: hashSecret,
          },
          expirySecs: BigInt(45),
          sourceCertificate: sourceCert,
          destinationCertificate: destCert,
        },
      }),
    );

    expect(lockResult).toBeTruthy();

    const claimResult = await client.claimLockedAssetV1(
      new ClaimLockedAssetV1Request({
        assetLockClaimV1PB: {
          asset: {
            assetType: assetType,
            assetId: lockAssetName,
          },
          source: {
            network: net1,
            userId: user1,
          },
          destination: {
            network: net1,
            userId: user2,
          },
          sourceCertificate: sourceCert,
          destCertificate: destCert,
          hashInfo: {
            secret: hashSecret,
          },
        },
      }),
    );
    expect(claimResult).toBeTruthy();
  });

  */

  test("corda-corda can lock/claim tokens on same network", async () => {
    log.info("adding tokens...");
    const assetType = "token1";
    const assetQuantity = 10;

    //await assetManager.addToken(assetType, assetQuantity, u1n1);

    log.info("getting certs");

    const srcCert = await cordaTestnet.getCertificateString(u2n1);
    const destCert = await cordaTestnet.getCertificateString(u1n1);

    const lockResult = await client.lockAssetV1(
      new LockAssetV1Request({
        assetLockV1PB: {
          asset: {
            assetType: assetType,
            assetQuantity: assetQuantity,
          },
          owner: { network: u2n1.organization, userId: u2n1.userId },
          hashInfo: {
            secret: hashSecret,
          },
          expirySecs: BigInt(45),
          sourceCertificate: srcCert,
          destinationCertificate: u1n1.userId,
        },
      }),
    );

    expect(lockResult).toBeTruthy();
    expect(lockResult.lockId).toBeString();
    log.debug(lockResult.lockId);

    const claimResult = await client.claimLockedAssetV1(
      new ClaimLockedAssetV1Request({
        assetLockClaimV1PB: {
          lockId: lockResult.lockId,
          asset: {
            assetType: assetType,
            assetQuantity: assetQuantity,
          },
          source: { network: u2n1.organization, userId: u2n1.userId },
          destination: { network: u1n1.organization, userId: u1n1.userId },
          sourceCertificate: srcCert,
          destCertificate: destCert,
          hashInfo: {
            secret: hashSecret,
          },
        },
      }),
    );
    expect(claimResult).toBeTruthy();
  });
});
