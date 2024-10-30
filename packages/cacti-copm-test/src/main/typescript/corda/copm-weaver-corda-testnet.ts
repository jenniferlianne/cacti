import {
  DLAccount,
  CopmContractNames,
  DefaultService,
} from "@hyperledger-cacti/cacti-copm-core";
import { LogLevelDesc, Logger } from "@hyperledger/cactus-common";
//import { TestAssets } from "./test-assets";
//import { CordaTransactionContextFactory } from "../../../main/typescript/lib/corda-transaction-context-factory";
//import { TestAssets, WeaverInteropConfiguration } from "@hyperledger-cacti/cacti-copm-test";
import * as fs from "fs";
import * as path from "path";
//import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";
//import { TestCordaConfig } from "./test-corda-config";
import { createPromiseClient, PromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { CopmTester } from "../interfaces/copm-tester";
import { TestAssets } from "../interfaces/test-assets";
import { CopmNetworkMode } from "../lib/types";
//import { TestAssetsCorda } from "./test-assets-corda";
//import { TestCordaConnector } from "./test-corda-connector";
import { TestAssetsCordaCli } from "./test-assets-corda-cli";

export class CopmWeaverCordaTestnet implements CopmTester {
  logLevel: LogLevelDesc = "INFO";
  log: Logger;
  //cordaTransactionFactory: CordaTransactionContextFactory;
  //cordaConfig: TestCordaConfig;
  contractNames: CopmContractNames;

  private assetContractName: string;
  private hostAddr: string;
  private networkMode: CopmNetworkMode;
  private testAssetMap = new Map<string, TestAssetsCordaCli>();

  constructor(log: Logger, networkMode: CopmNetworkMode) {
    this.log = log;
    this.networkMode = networkMode;
    this.hostAddr = "127.0.0.1";
    this.assetContractName = "com.cordaSimpleApplication.flow";
    this.contractNames = {
      pledgeContract: "org.hyperledger.cacti.weaver.imodule.corda.flows",
      lockContract: "org.hyperledger.cacti.weaver.imodule.corda.flows",
    };

    this.writeClientJson(this.hostAddr);
  }

  public async assetsFor(account: DLAccount): Promise<TestAssets> {
    const accountKey = account.userId + "@" + account.organization;
    if (!this.testAssetMap.has(accountKey)) {
      this.testAssetMap.set(accountKey, await this.createTestAssets(account));
    }
    const assets = this.testAssetMap.get(accountKey);
    if (!assets) {
      throw Error(`no assets found for account ${accountKey}`);
    }
    return assets;
  }

  private async createTestAssets(
    account: DLAccount,
  ): Promise<TestAssetsCordaCli> {
    return new TestAssetsCordaCli(account, this.log);
  }
  /*

  private async createTestAssets(account: DLAccount): Promise<TestAssetsCorda> {
    const accountKey = account.userId + "@" + account.organization;

    const corda_rpc_file = path.join(
      __dirname,
      this.packageRelativePath,
      "corda_rpc.json",
    );
    const config = JSON.parse(fs.readFileSync(corda_rpc_file).toString());
    if (!config[accountKey]) {
      throw Error(`account ${accountKey} not found in ${corda_rpc_file}`);
    }
    const client = config[accountKey];
    const assets = new TestAssetsCorda(
      account,
      this.assetContractName,
      new TestCordaConnector(
        client.username,
        client.password,
        "172.17.0.1",
        //client.host,
        client.port,
        this.log,
      ),
      this.log,
    );
    await assets.start();
    return assets;
  }
*/
  public networkNames(): string[] {
    return ["Corda_Network", "Corda_Network2"];
  }

  async startServer() {
  }

  async stopServer() {
/*
    for (const [_, assets] of this.testAssetMap) {
      await assets.stop();
    }
*/
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
  public getPartyA(_assetType: string): DLAccount {
    return {
      organization: "Corda_Network",
      userId: "O=PartyA, L=London, C=GB",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getPartyB(_assetType: string): DLAccount {
    switch (this.networkMode) {
      case CopmNetworkMode.Pledge:
        return {
          organization: "Corda_Network2",
          userId: "O=PartyA, L=London, C=GB",
        };
      case CopmNetworkMode.Lock:
        return {
          organization: "Corda_Network",
          userId: "O=PartyB, L=London, C=GB",
        };
      default:
        throw Error("network mode not implemented");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public clientFor(account: DLAccount): PromiseClient<typeof DefaultService> {
    const cordaServerPort = 9199;
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

  public async getVerifyViewCmd(
    pledgeId: string,
    src_crt: string,
    dest_cert: string,
    organization: string,
  ): Promise<{
    contractId: string;
    function: string;
    input: string[];
  }> {
    return {
      contractId: "com.cordaSimpleApplication.flow",
      function: "GetAssetPledgeStatusByPledgeId",
      input: [pledgeId, organization],
    };
  }

  public assets() {
    /*
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    return new TestAssets(
      this.assetContractName,
      this.cordaTransactionFactory,
      this.log,
    );
    */
  }

  private packageRelativePath = "../../../../";
  private weaverRelativePath = "../../../../../../weaver/";

  public getCertificateString(account: DLAccount): Promise<string> {
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
