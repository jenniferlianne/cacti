/*import { AddressInfo } from "net";
import { ICactusApiServerOptions } from "@hyperledger/cactus-cmd-api-server";
import { Config } from "convict";
import { LogLevelDesc } from "@hyperledger/cactus-common";

import {
  AuthorizationProtocol,
  ConfigService,
} from "@hyperledger/cactus-cmd-api-server";

export async function testApiSvrCfg(
  addressInfoHttp: AddressInfo,
  logLevel: LogLevelDesc,
): Promise<Config<ICactusApiServerOptions>> {
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
  return cfg;
}
*/