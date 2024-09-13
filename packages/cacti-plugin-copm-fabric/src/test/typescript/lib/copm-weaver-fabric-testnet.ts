import { Identity } from "fabric-network";
import { DLTransactionContextFactory } from "../../../main/typescript/lib/dl-context-factory";
import {
  DLAccount,
  CopmContractNames,
} from "../../../main/typescript/lib/types";
import { LogLevelDesc, Logger } from "@hyperledger/cactus-common";
import { TestAssetManager } from "./test-asset-manager";
import { TestFabricConfiguration } from "./test-fabric-configuration";
import { FabricContextFactory } from "../../../main/typescript/lib/fabric-context-factory";
import { TestInteropConfiguration } from "./test-interop-configuration";
import { DLTransactionContext } from "../../../main/typescript/lib/dl-transaction-context";

type FabricIdentity = Identity & {
  credentials: {
    certificate: string;
    privateKey: string;
  };
};

export class CopmWeaverFabricTestnet {
  logLevel: LogLevelDesc = "INFO";
  log: Logger;

  private assetContractName: string;
  private networkAdminName: string;
  private fabricConfig: TestFabricConfiguration;
  private fabricContextFactory: FabricContextFactory;

  constructor(log: Logger, assetContractName: string) {
    this.log = log;
    this.assetContractName = assetContractName;
    this.networkAdminName = "networkadmin";
    this.fabricConfig = new TestFabricConfiguration(log);
    this.fabricContextFactory = new FabricContextFactory(
      this.fabricConfig,
      new TestInteropConfiguration("interop", log),
      log,
    );
  }

  public networkNames(): string[] {
    return ["network1", "network2"];
  }

  public userNames(): string[] {
    return ["alice", "bob"];
  }

  public getContractNames(): CopmContractNames {
    return {
      pledgeContract: "simpleassettransfer",
      lockContract: "simpleasset",
    };
  }

  public async setup(): Promise<DLTransactionContextFactory> {
    return this.fabricContextFactory;
  }

  public async getCertificateString(account: DLAccount): Promise<string> {
    const wallet = await this.fabricConfig.getOrgWallet(account.organization);
    const identity = (await wallet.get(account.userId)) as FabricIdentity;
    if (!identity?.credentials?.certificate) {
      throw new Error(`no credentials for user ${account.userId}`);
    }
    const userCert = Buffer.from(identity.credentials.certificate).toString(
      "base64",
    );
    return userCert;
  }

  public assetManager() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const testnet = this;
    return new TestAssetManager(
      this.assetContractName,
      this.networkAdminName,
      async function (account: DLAccount): Promise<DLTransactionContext> {
        return await testnet.fabricContextFactory.getTransactionContext(
          account,
        );
      },
      async function (account: DLAccount): Promise<string> {
        return await testnet.getCertificateString(account);
      },
      this.log,
    );
  }
}
