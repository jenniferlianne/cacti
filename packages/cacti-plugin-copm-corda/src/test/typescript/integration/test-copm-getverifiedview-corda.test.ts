import { AddressInfo } from "node:net";
import http from "node:http";

import "jest-extended";
import { v4 as uuidV4 } from "uuid";
import { PromiseClient } from "@connectrpc/connect";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { CopmWeaverCordaTestnet } from "../lib/copm-weaver-corda-testnet";

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
import {
  GetVerifiedViewV1Request,
  DefaultService,
} from "@hyperledger-cacti/cacti-copm-core";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const logLevel: LogLevelDesc = "DEBUG";
const log: Logger = LoggerProvider.getOrCreate({
  label: "plugin-copm-crpc-server-test",
  level: logLevel,
});

describe("Copm Verify View", () => {
  let httpServer: http.Server;
  let apiServer: ApiServer;
  let clientPartyA: PromiseClient<typeof DefaultService>;
  let testNet: CopmWeaverCordaTestnet;

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

    fabricTestnet = new CopmWeaverFabricTestnet(log, contractName);

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

    testNet = new CopmWeaverCordaTestnet(addressInfoHttp.address, log);

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

  test("get verified view", async () => {
    const partyA = testNet.getPledgePartyA("bond");
    const partyB = testNet.getPledgePartyB("bond");
    clientPartyA = testNet.clientFor(partyA);

    const res = await clientPartyA.getVerifiedViewV1(
      new GetVerifiedViewV1Request({
        getVerifiedViewV1RequestPB: {
          account: {
            network: partyA.organization,
            userId: partyA.userId,
          },
          view: {
            network: partyB.organization,
            viewAddress: testNet.getVerifyViewCmd(),
          },
        },
      }),
    );
    expect(res).toBeTruthy();
    expect(res.data).toBeString();
    log.info(res.data);
    expect(res.data).toContain(testNet.getVerifiedViewExpectedResult());
  });
});
