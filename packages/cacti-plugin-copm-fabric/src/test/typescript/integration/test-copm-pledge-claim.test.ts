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
  ClaimPledgedAssetV1Request,
  PledgeAssetV1Request,
} from "../../../main/typescript/generated/services/default_service_pb";
import { AssetAccountV1PB } from "../../../main/typescript/generated/models/asset_account_v1_pb_pb";
import { DLTransactionContextFactory } from "../../../main/typescript/lib/dl-context-factory";
import { DLAccount } from "../../../main/typescript/lib/types";
import { CopmWeaverFabricTestnet } from "../lib/copm-weaver-fabric-testnet";
import { TestAssetManager } from "../lib/test-asset-manager";
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
  let sourceAccount: DLAccount, destAccount: DLAccount;
  let sourceCert: string, destCert: string;
  let sourceAccountPB: AssetAccountV1PB, destAccountPB: AssetAccountV1PB;
  let assetManager: TestAssetManager;
  const contractName: string = "simpleassettransfer";
  const pledgeAssetName: string =
    "pledgeasset" + new Date().getTime().toString();

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

    log.info("setting up fabric test network");

    fabricTestnet = new CopmWeaverFabricTestnet(log, contractName);

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

    const [net1, net2] = fabricTestnet.networkNames();
    const [user1, user2] = fabricTestnet.userNames();
    assetManager = fabricTestnet.assetManager();
    sourceAccount = { organization: net1, userId: user1 };
    destAccount = { organization: net2, userId: user2 };
    sourceAccountPB = AssetAccountV1PB.fromJson({
      network: net1,
      userId: user1,
    });
    destAccountPB = AssetAccountV1PB.fromJson({ network: net2, userId: user2 });
    sourceCert = await fabricTestnet.getCertificateString(sourceAccount);
    destCert = await fabricTestnet.getCertificateString(destAccount);

    log.info("test setup complete");
  });

  afterAll(async () => {
    if (apiServer) {
      await apiServer.shutdown();
    }
  });

  test("fabric-fabric asset nft pledge and claim", async () => {
    const transport = createConnectTransport({
      baseUrl: apiHttpHost,
      httpVersion: "1.1",
    });

    const assetType = "bond01";

    await assetManager.addNonFungibleAsset(
      assetType,
      pledgeAssetName,
      sourceAccount,
    );

    const client = createPromiseClient(DefaultService, transport);

    const pledgeNFTResult = await client.pledgeAssetV1(
      new PledgeAssetV1Request({
        assetPledgeV1PB: {
          asset: {
            assetType: assetType,
            assetId: pledgeAssetName,
          },
          source: sourceAccountPB,
          destination: destAccountPB,
          expirySecs: BigInt(45),
          destinationCertificate: destCert,
        },
      }),
    );

    expect(pledgeNFTResult).toBeTruthy();
    expect(pledgeNFTResult.pledgeId).toBeString();

    const claimNFTResult = await client.claimPledgedAssetV1(
      new ClaimPledgedAssetV1Request({
        assetPledgeClaimV1PB: {
          pledgeId: pledgeNFTResult.pledgeId,
          asset: {
            assetType: assetType,
            assetId: pledgeAssetName,
          },
          source: sourceAccountPB,
          destination: {
            network: destAccount.organization,
            userId: destAccount.userId,
          },
          sourceCertificate: sourceCert,
          destCertificate: destCert,
        },
      }),
    );
    expect(claimNFTResult).toBeTruthy();

    // Check that the asset changed networks.
    expect(
      await assetManager.userOwnsNonFungibleAsset(
        assetType,
        pledgeAssetName,
        sourceAccount,
      ),
    ).toBeFalse();

    expect(
      await assetManager.userOwnsNonFungibleAsset(
        assetType,
        pledgeAssetName,
        destAccount,
      ),
    ).toBeTrue();
  });

  test("fabric-fabric asset token pledge and claim", async () => {
    const transport = createConnectTransport({
      baseUrl: apiHttpHost,
      httpVersion: "1.1",
    });

    const assetType = "token1";
    const exchangeQuantity = 10;

    // ensure initial account balance
    await assetManager.addToken(assetType, exchangeQuantity, sourceAccount);
    await assetManager.addToken(assetType, exchangeQuantity, destAccount);

    const user1originalbalance = await assetManager.tokenBalance(
      assetType,
      sourceAccount,
    );
    const user2originalbalance = await assetManager.tokenBalance(
      assetType,
      destAccount,
    );

    const client = createPromiseClient(DefaultService, transport);

    const pledgeResult = await client.pledgeAssetV1(
      new PledgeAssetV1Request({
        assetPledgeV1PB: {
          asset: {
            assetType: assetType,
            assetQuantity: exchangeQuantity,
          },
          source: sourceAccountPB,
          destination: destAccountPB,
          expirySecs: BigInt(45),
          destinationCertificate: destCert,
        },
      }),
    );

    expect(pledgeResult).toBeTruthy();
    expect(pledgeResult.pledgeId).toBeString();

    const claimResult = await client.claimPledgedAssetV1(
      new ClaimPledgedAssetV1Request({
        assetPledgeClaimV1PB: {
          pledgeId: pledgeResult.pledgeId,
          asset: {
            assetType: assetType,
            assetQuantity: exchangeQuantity,
          },
          source: sourceAccountPB,
          destination: destAccountPB,
          sourceCertificate: sourceCert,
          destCertificate: destCert,
        },
      }),
    );
    expect(claimResult).toBeTruthy();

    // Check that the tokens changed networks.
    expect(await assetManager.tokenBalance(assetType, sourceAccount)).toEqual(
      user1originalbalance - exchangeQuantity,
    );

    expect(await assetManager.tokenBalance(assetType, destAccount)).toEqual(
      user2originalbalance + exchangeQuantity,
    );
  });
});
