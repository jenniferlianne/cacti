import { AddressInfo } from "node:net";
import http from "node:http";

import "jest-extended";
import { v4 as uuidV4 } from "uuid";
import { createPromiseClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
  Servers,
} from "@hyperledger/cactus-common";
import { ApiServer } from "@hyperledger/cactus-cmd-api-server";
import { AuthorizationProtocol } from "@hyperledger/cactus-cmd-api-server";
import { ConfigService } from "@hyperledger/cactus-cmd-api-server";
import { PluginCopmFabric } from "../../../main/typescript/plugin-copm-fabric";
import { DefaultService } from "../../../main/typescript/generated/services/default_service_connect";
import {
  ClaimLockedAssetV1Request,
  LockAssetV1Request,
} from "../../../main/typescript/generated/services/default_service_pb";
import { DLTransactionContextFactory } from "../../../main/typescript/lib/dl-context-factory";
import { CopmWeaverFabricTestnet } from "../lib/copm-weaver-fabric-testnet";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const logLevel: LogLevelDesc = "DEBUG";
const log: Logger = LoggerProvider.getOrCreate({
  label: "plugin-copm-crpc-server-test",
  level: logLevel,
});

describe("PluginCopmFabric", () => {
  let fabricTestnet: CopmWeaverFabricTestnet;
  let httpServer: http.Server;
  let DLTransactionContextFactory: DLTransactionContextFactory;
  let apiServer: ApiServer;
  let addressInfoHttp: AddressInfo;
  let apiHttpHost: string;
  const hashSecret: string = "my_secret_123";
  const lockAssetName: string = "lockasset" + new Date().getTime().toString();

  beforeAll(async () => {
    httpServer = await Servers.startOnPreferredPort(4050);
    addressInfoHttp = httpServer.address() as AddressInfo;
    apiHttpHost = `http://${addressInfoHttp.address}:${addressInfoHttp.port}`;
    log.debug("HTTP API host: %s", apiHttpHost);

    const pluginRegistry = new PluginRegistry({ plugins: [] });

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

    fabricTestnet = new CopmWeaverFabricTestnet(log, "simpleasset");
    DLTransactionContextFactory = await fabricTestnet.setup();

    const compFabricPlugin = new PluginCopmFabric({
      instanceId: uuidV4(),
      logLevel,
      DLTransactionContextFactory,
      contractNames: fabricTestnet.getContractNames(),
    });

    pluginRegistry.add(compFabricPlugin);

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
    log.info("contract deployed");
  });

  afterAll(async () => {
    await fabricTestnet.tearDown();
    if (apiServer) {
      await apiServer.shutdown();
    }
  });

  test("fabric-fabric can lock/claim asset on same network", async () => {
    const transport = createConnectTransport({
      baseUrl: apiHttpHost,
      httpVersion: "1.1",
    });

    const net1 = fabricTestnet.networkNames()[0];
    const [user1, user2] = fabricTestnet.userNames();
    const assetManager = fabricTestnet.assetManager();
    const assetType = "bond";

    await assetManager.addNonFungibleAsset(
      assetType,
      lockAssetName,
      user1,
      net1,
    );

    const client = createPromiseClient(DefaultService, transport);
    const source_cert = await fabricTestnet.getCertificateString(net1, user1);
    const dest_cert = await fabricTestnet.getCertificateString(net1, user2);

    const res1 = await client.lockAssetV1(
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
          sourceCertificate: source_cert,
          destinationCertificate: dest_cert,
        },
      }),
    );

    expect(res1).toBeTruthy();

    const res3 = await client.claimLockedAssetV1(
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
          sourceCertificate: source_cert,
          destCertificate: dest_cert,
          hashInfo: {
            secret: hashSecret,
          },
        },
      }),
    );
    expect(res3).toBeTruthy();
  });
});
