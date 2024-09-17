import { DLAccount, CopmContractNames } from "@hyperledger/cacti-copm-core";
import { LogLevelDesc, Logger } from "@hyperledger/cactus-common";
import { TestAssets } from "./test-assets";
import { CordaTransactionContextFactory } from "../../../main/typescript/lib/corda-transaction-context-factory";
import { TestInteropConfiguration } from "@hyperledger/cacti-copm-test-tooling";
import * as jks from "jks-js";
import * as fs from "fs";
import * as path from "path";
import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { TestCordaConfig } from "./test-corda-config";

export class CopmWeaverCordaTestnet {
  logLevel: LogLevelDesc = "INFO";
  log: Logger;
  cordaTransactionFactory: CordaTransactionContextFactory;
  cordaConfig: TestCordaConfig;
  interopConfig: TestInteropConfiguration;
  contractNames: CopmContractNames;

  private assetContractName: string;

  constructor(log: Logger) {
    this.log = log;
    this.interopConfig = new TestInteropConfiguration("interop", this.log);
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
  }

  public addTestUser(account: DLAccount, api: CordaApi) {
    this.cordaConfig.addTestUser(account, api);
  }

  public networkNames(): string[] {
    return ["Corda_Network", "Corda_Network2"];
  }

  public userNames(): string[] {
    return ["O=PartyA, L=London, C=GB", "O=PartyB, L=London, C=GB"];
  }

  public assets() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    return new TestAssets(
      this.assetContractName,
      this.cordaTransactionFactory,
      this.log,
    );
  }

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
