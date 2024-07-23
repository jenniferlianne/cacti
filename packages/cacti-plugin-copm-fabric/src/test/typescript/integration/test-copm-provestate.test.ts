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
  ProvestateV1Request,
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
  let networkNames: string[];
  let httpServer: http.Server;
  let DLTransactionContextFactory: DLTransactionContextFactory;
  let apiServer: ApiServer;
  let addressInfoHttp: AddressInfo;
  let apiHttpHost: string;
  const contractName: string = "simpleassettransfer";
  const proveAssetName: string = "proveasset" + new Date().getTime().toString();

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

    networkNames = fabricTestnet.networkNames();

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
    log.info("test setup complete");
  });

  afterAll(async () => {
    await fabricTestnet.tearDown();
    if (apiServer) {
      await apiServer.shutdown();
    }
  });

  test("fabric-fabric prove state", async () => {
    const transport = createConnectTransport({
      baseUrl: apiHttpHost,
      httpVersion: "1.1",
    });

    await fabricTestnet.addNonFungibleAsset(
      "bond",
      proveAssetName,
      "alice",
      networkNames[0],
    );

    const source_cert = await fabricTestnet.getCertificateString(
      networkNames[0],
      "alice",
    );
    const dest_cert = await fabricTestnet.getCertificateString(
      networkNames[1],
      "bob",
    );

    const client = createPromiseClient(DefaultService, transport);

    const resPledge = await client.pledgeAssetV1(
      new PledgeAssetV1Request({
        assetPledgeV1PB: {
          asset: {
            assetType: "bond",
            assetId: proveAssetName,
          },
          source: {
            network: networkNames[0],
            userId: "alice",
          },
          destination: {
            network: networkNames[1],
            userId: "bob",
          },
          expirySecs: BigInt(45),
          destinationCertificate: dest_cert,
        },
      }),
    );

    expect(resPledge).toBeTruthy();

    const args = [resPledge, source_cert, networkNames[1], dest_cert];

    const res = await client.provestateV1(
      new ProvestateV1Request({
        stateProofV1PB: {
          user: {
            network: networkNames[0],
            userId: "alice",
          },
          viewAddress: {
            network: networkNames[1],
            view: {
              contractId: contractName,
              function: "GetAssetPledgeStatus",
              input: args.join(";"),
            },
          },
        },
      }),
    );

    expect(res).toBeTruthy();
  });
});
