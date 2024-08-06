import { AddressInfo } from "node:net";
import http from "node:http";

import "jest-extended";
import { v4 as uuidV4 } from "uuid";
import { createPromiseClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { createGrpcWebTransport } from "@connectrpc/connect-node";

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
  ClaimAssetV1Request,
  PledgeAssetV1Request,
  ProvestateV1Request,
} from "../../../main/typescript/generated/services/default_service_pb";

const logLevel: LogLevelDesc = "DEBUG";

describe("PluginCopmFabric", () => {
  const log: Logger = LoggerProvider.getOrCreate({
    label: "plugin-ledger-connector-besu-grpc-service-test",
    level: logLevel,
  });

  let httpServer: http.Server;
  let apiServer: ApiServer;
  let addressInfoHttp: AddressInfo;
  let apiHttpHost: string;

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

    const compFabricPlugin = new PluginCopmFabric({
      instanceId: uuidV4(),
      logLevel,
    });

    pluginRegistry.add(compFabricPlugin);

    apiServer = new ApiServer({
      httpServerApi: httpServer,
      config: cfg.getProperties(),
      pluginRegistry,
    });

    const { addressInfoGrpc, addressInfoCrpc } = await apiServer.start();
    const grpcPort = addressInfoGrpc.port;
    const grpcHost = addressInfoGrpc.address;
    const grpcFamily = addressInfoHttp.family;
    log.info("gRPC family=%s host=%s port=%s", grpcFamily, grpcHost, grpcPort);
    log.info("CRPC AddressInfo=%o", addressInfoCrpc);
    expect(apiServer).toBeTruthy();
  });

  afterAll(async () => {
    await apiServer.shutdown();
  });

  test("works via CRPC API server - HTTP/1.1 Transport:Connect all methods", async () => {
    const transport = createConnectTransport({
      baseUrl: apiHttpHost,
      httpVersion: "1.1",
    });

    const client = createPromiseClient(DefaultService, transport);
    const res1 = client.pledgeAssetV1(new PledgeAssetV1Request());

    expect(res1).toBeTruthy();
    expect((await res1).pledgeId).toEqual("mypledgeid");

    const res2 = client.claimAssetV1(new ClaimAssetV1Request());
    expect(res2).toBeTruthy();
    expect((await res2).claimId).toEqual("myclaimid");

    const res3 = await client.provestateV1(new ProvestateV1Request());
    expect(res3).toBeTruthy();
  });
});
