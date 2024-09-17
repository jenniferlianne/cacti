import {
  DLAccount,
  CopmContractNames,
  DefaultService,
} from "@hyperledger-cacti/cacti-copm-core";
import { LogLevelDesc, Logger } from "@hyperledger/cactus-common";
import { TestAssets } from "./test-assets";
import { CordaTransactionContextFactory } from "../../../main/typescript/lib/corda-transaction-context-factory";
import { WeaverInteropConfiguration } from "@hyperledger-cacti/cacti-copm-test-tooling";
import * as fs from "fs";
import * as path from "path";
import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { TestCordaConfig } from "./test-corda-config";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { InteropTester } from "@hyperledger-cacti/cacti-copm-test-tooling";

export class CopmWeaverCordaTestnet implements InteropTester {
  logLevel: LogLevelDesc = "INFO";
  log: Logger;
  cordaTransactionFactory: CordaTransactionContextFactory;
  cordaConfig: TestCordaConfig;
  interopConfig: WeaverInteropConfiguration;
  contractNames: CopmContractNames;

  private assetContractName: string;
  private hostAddr: string;

  constructor(hostAddr: string, log: Logger) {
    this.log = log;
    this.hostAddr = hostAddr;
    this.interopConfig = new WeaverInteropConfiguration("interop", this.log);
    this.cordaConfig = new TestCordaConfig(log);
    this.cordaTransactionFactory = new CordaTransactionContextFactory(
      this.cordaConfig,
      this.interopConfig,
      this.log,
    );
    this.assetContractName = "com.cordaSimpleApplication.flow";
    this.contractNames = {
      pledgeContract: "org.hyperledger.cacti.weaver.imodule.corda.flows",
      lockContract: "org.hyperledger.cacti.weaver.imodule.corda.flows",
    };

    this.writeClientJson(hostAddr);
  }

  public writeClientJson(hostAddr: string) {
    // todo: pass this as an env var to the spring client
    const username = "clientUser1";
    const password = "test";
    const json = {
      "O=PartyA, L=London, C=GB@Corda_Network": {
        host: hostAddr,
        username: username,
        password: password,
        port: 10006,
      },
      "O=PartyB, L=London, C=GB@Corda_Network": {
        host: hostAddr,
        username: username,
        password: password,
        port: 10009,
      },
      "O=PartyA, L=London, C=GB@Corda_Network2": {
        host: hostAddr,
        username: username,
        password: password,
        port: 30006,
      },
      "O=PartyB, L=London, C=GB@Corda_Network2": {
        host: hostAddr,
        username: username,
        password: password,
        port: 30009,
      },
    };
    const clientFile = path.join(
      __dirname,
      this.packageRelativePath,
      "corda_rpc.json",
    );

    fs.writeFileSync(clientFile, JSON.stringify(json));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getPledgePartyA(_assetType: string): DLAccount {
    return {
      organization: "Corda_Network",
      userId: "O=PartyA, L=London, C=GB",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getPledgePartyB(_assetType: string): DLAccount {
    return {
      organization: "Corda_Network2",
      userId: "O=PartyA, L=London, C=GB",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public clientFor(account: DLAccount) {
    const cordaServerPort = 9090;
    const transport = createGrpcTransport({
      // Requests will be made to <baseUrl>/<package>.<service>/method
      baseUrl: `http://${this.hostAddr}:${cordaServerPort}`,
      httpVersion: "2",
    });
    return createPromiseClient(DefaultService, transport);
  }

  public getVerifiedViewExpectedResult(): string {
    return "UniqueIdentifier";
  }

  public getVerifyViewCmd(): {
    contractId: string;
    function: string;
    input: string[];
  } {
    return {
      contractId: "com.cordaSimpleApplication.flow",
      function: "GetStateByKey",
      input: ["H"],
    };
  }

  public assets() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    return new TestAssets(
      this.assetContractName,
      this.cordaTransactionFactory,
      this.log,
    );
  }

  private packageRelativePath = "../../../../";
  private weaverRelativePath = "../../../../../../weaver/";

  public getCertificateString(account: DLAccount): string {
    const certsFile = path.join(
      __dirname,
      this.weaverRelativePath,
      `samples/corda/corda-simple-application/clients/src/main/resources/config/remoteNetworkUsers/${account.organization}_UsersAndCerts.json`,
    );
    const configJSON = JSON.parse(fs.readFileSync(certsFile).toString());
    if (!configJSON[account.userId]) {
      throw Error(`${account.userId} not found in json at ${certsFile}`);
    }
    return configJSON[account.userId];
  }
}
