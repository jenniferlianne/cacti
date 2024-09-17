import { AddressInfo } from "node:net";
import http from "node:http";
import "jest-extended";

import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
  Servers,
} from "@hyperledger/cactus-common";
import { ApiServer } from "@hyperledger/cactus-cmd-api-server";
import {
  ClaimPledgedAssetV1Request,
  PledgeAssetV1Request,
} from "@hyperledger-cacti/cacti-copm-core";
import { CopmWeaverCordaTestnet } from "../lib/copm-weaver-corda-testnet";
//import { TestAssetManager } from "../lib/test-asset-manager";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const logLevel: LogLevelDesc = "DEBUG";
const log: Logger = LoggerProvider.getOrCreate({
  label: "plugin-copm-crpc-server-test",
  level: logLevel,
});

describe("PluginCopmFabric", () => {
  let testNet: CopmWeaverCordaTestnet;
  let httpServer: http.Server;
  let apiServer: ApiServer;
  //let assetManager: TestAssetManager;

  const pledgeAssetName: string =
    "pledgeasset" + new Date().getTime().toString();

  beforeAll(async () => {
    httpServer = await Servers.startOnPreferredPort(4050);
    const addressInfoHttp = httpServer.address() as AddressInfo;
    /*
    const apiHttpHost = `http://${addressInfoHttp.address}:${addressInfoHttp.port}`;
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
    */
    testNet = new CopmWeaverCordaTestnet(addressInfoHttp.address, log);

    /*
    const compFabricPlugin = new PluginCopmFabric({
      instanceId: uuidV4(),
      logLevel,
      fabricConfig: fabricTestnet.fabricConfig,
      interopConfig: fabricTestnet.interopConfig,
      contractNames: fabricTestnet.contractNames,
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
    */
    //assetManager = fabricTestnet.assetManager();

    log.info("test setup complete");
  });

  afterAll(async () => {
    if (apiServer) {
      await apiServer.shutdown();
    }
    if (httpServer) {
      await httpServer.close();
    }
  });

  test("corda-corda asset nft pledge and claim by asset id", async () => {
    const assetType = "bond01";
    const sourceAccount = testNet.getPledgePartyA(assetType);
    const destAccount = testNet.getPledgePartyB(assetType);
    const clientPartyA = testNet.clientFor(sourceAccount);
    const clientPartyB = testNet.clientFor(destAccount);
    const sourceCert = await testNet.getCertificateString(sourceAccount);
    const destCert = await testNet.getCertificateString(destAccount);

    /*
    await assetManager.addNonFungibleAsset(
      assetType,
      pledgeAssetName,
      sourceAccount,
    );
    */

    const pledgeNFTResult = await clientPartyA.pledgeAssetV1(
      new PledgeAssetV1Request({
        assetPledgeV1PB: {
          asset: {
            assetType: assetType,
            assetId: pledgeAssetName,
          },
          source: {
            network: sourceAccount.organization,
            userId: sourceAccount.userId,
          },
          destination: {
            network: destAccount.organization,
            userId: destAccount.userId,
          },
          expirySecs: BigInt(45),
          destinationCertificate: destCert,
        },
      }),
    );

    expect(pledgeNFTResult).toBeTruthy();
    expect(pledgeNFTResult.pledgeId).toBeString();

    const claimNFTResult = await clientPartyB.claimPledgedAssetV1(
      new ClaimPledgedAssetV1Request({
        assetPledgeClaimV1PB: {
          pledgeId: pledgeNFTResult.pledgeId,
          asset: {
            assetType: assetType,
            assetId: pledgeAssetName,
          },
          source: {
            network: sourceAccount.organization,
            userId: sourceAccount.userId,
          },
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

    /*
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
    */
  });

  test("corda-corda asset token pledge and claim", async () => {
    const assetType = "token1";
    const exchangeQuantity = 10;

    const sourceAccount = testNet.getPledgePartyA(assetType);
    const destAccount = testNet.getPledgePartyB(assetType);

    const clientPartyA = testNet.clientFor(sourceAccount);
    const clientPartyB = testNet.clientFor(destAccount);

    const sourceCert = await testNet.getCertificateString(sourceAccount);
    const destCert = await testNet.getCertificateString(destAccount);

    // ensure initial account balance - user will not have a wallet if 0 tokens
    /*
    await assetManager.addToken(assetType, 1 + exchangeQuantity, sourceAccount);
    await assetManager.addToken(assetType, 1, destAccount);

    const user1StartBalance = await assetManager.tokenBalance(
      assetType,
      sourceAccount,
    );
    const user2StartBalance = await assetManager.tokenBalance(
      assetType,
      destAccount,
    );
*/
    const pledgeResult = await clientPartyA.pledgeAssetV1(
      new PledgeAssetV1Request({
        assetPledgeV1PB: {
          asset: {
            assetType: assetType,
            assetQuantity: exchangeQuantity,
          },
          source: {
            network: sourceAccount.organization,
            userId: sourceAccount.userId,
          },
          destination: {
            network: destAccount.organization,
            userId: destAccount.userId,
          },
          expirySecs: BigInt(45),
          destinationCertificate: destCert,
        },
      }),
    );

    expect(pledgeResult).toBeTruthy();
    expect(pledgeResult.pledgeId).toBeString();

    const claimResult = await clientPartyB.claimPledgedAssetV1(
      new ClaimPledgedAssetV1Request({
        assetPledgeClaimV1PB: {
          pledgeId: pledgeResult.pledgeId,
          asset: {
            assetType: assetType,
            assetQuantity: exchangeQuantity,
          },
          source: {
            network: sourceAccount.organization,
            userId: sourceAccount.userId,
          },
          destination: {
            network: destAccount.organization,
            userId: destAccount.userId,
          },
          sourceCertificate: sourceCert,
          destCertificate: destCert,
        },
      }),
    );
    expect(claimResult).toBeTruthy();

    /*
    // Check that the tokens changed networks.
    expect(await assetManager.tokenBalance(assetType, sourceAccount)).toEqual(
      user1StartBalance - exchangeQuantity,
    );

    expect(await assetManager.tokenBalance(assetType, destAccount)).toEqual(
      user2StartBalance + exchangeQuantity,
    );
    */
  });
});
