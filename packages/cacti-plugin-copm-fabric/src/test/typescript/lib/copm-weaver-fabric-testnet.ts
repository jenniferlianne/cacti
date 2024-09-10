/* eslint-disable @typescript-eslint/no-this-alias */
import path from "path";
import fs from "fs-extra";
import { Wallet, Identity, DiscoveryOptions, Wallets } from "fabric-network";
import { DLTransactionContextFactory } from "../../../main/typescript/lib/dl-context-factory";
import {
  DLContractContext,
  DLAccount,
  RemoteNetworkConfig,
  CopmContractNames,
  LocalRelayConfig,
} from "../../../main/typescript/lib/types";
import { RemoteTransactionContext } from "../../../main/typescript/lib/remote-transaction-context";
import { DLTransactionContext } from "../../../main/typescript/lib/dl-transaction-context";
import { LogLevelDesc, Logger } from "@hyperledger/cactus-common";
import { TestAssetManager } from "./test-asset-manager";

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
  private interopContractName: string;
  private discoveryOptions: DiscoveryOptions;
  private networkAdminName: string;
  private weaverRelativePath = "../../../../../../weaver/";
  private weaverWalletPath = path.join(
    __dirname,
    this.weaverRelativePath,
    "samples/fabric/fabric-cli/src",
  );
  private weaverNetConfigPath = path.join(
    __dirname,
    this.weaverRelativePath,
    "samples/fabric/fabric-cli",
  );

  constructor(log: Logger, assetContractName: string) {
    this.log = log;
    this.assetContractName = assetContractName;
    this.interopContractName = "interop";
    this.networkAdminName = "networkadmin";
    this.discoveryOptions = {
      enabled: true,
      asLocalhost: true,
    };
  }

  public networkNames(): string[] {
    return ["network1", "network2"];
  }

  public userNames(): string[] {
    return ["alice", "bob"];
  }

  public async setup(): Promise<DLTransactionContextFactory> {
    /* eslint:disable-next-line - required for passing class functions to an interface */
    const testnet = this;
    const factory = {
      getTransactionContext: async function (
        account: DLAccount,
      ): Promise<DLTransactionContext> {
        return await testnet.getTransactionContext(account);
      },
      getRemoteTransactionContext: async function (
        account: DLAccount,
        remoteNetwork: string,
      ): Promise<RemoteTransactionContext> {
        return await testnet.getRemoteTransactionContext(
          account,
          remoteNetwork,
        );
      },
    };
    return factory;
  }

  public getContractNames(): CopmContractNames {
    return {
      pledgeContract: "simpleassettransfer",
      lockContract: "simpleasset",
    };
  }

  public async getCertificateString(account: DLAccount): Promise<string> {
    const wallet = await this.getOrgWallet(account.organization);
    const identity = (await wallet.get(account.userId)) as FabricIdentity;
    if (!identity?.credentials?.certificate) {
      throw new Error(`no credentials for user ${account.userId}`);
    }
    const userCert = Buffer.from(identity.credentials.certificate).toString(
      "base64",
    );
    return userCert;
  }

  public async tearDown() {}

  public async getRemoteTransactionContext(
    account: DLAccount,
    remoteNetwork: string,
  ): Promise<RemoteTransactionContext> {
    return new RemoteTransactionContext(
      await this.getContractContext(account.organization),
      this.getLocalRelayConfig(account.organization),
      account,
      this.getRemoteNetworkConfig(remoteNetwork),
      this.interopContractName,
      this.log,
    );
  }

  public assetManager() {
    const testnet = this;
    return new TestAssetManager(
      this.assetContractName,
      this.networkAdminName,
      async function (account: DLAccount): Promise<DLTransactionContext> {
        return await testnet.getTransactionContext(account);
      },
      async function (account: DLAccount): Promise<string> {
        return await testnet.getCertificateString(account);
      },
      this.log,
    );
  }

  public async getTransactionContext(
    account: DLAccount,
  ): Promise<DLTransactionContext> {
    const context = await this.getContractContext(account.organization);
    return new DLTransactionContext(context, account, this.log);
  }

  private async getContractContext(
    orgName: string,
  ): Promise<DLContractContext> {
    const weaverConfig = this.getWeaverNetworkConfig(orgName);
    if (!weaverConfig.mspId) {
      throw Error(`no mspId defined for ${orgName}`);
    }
    if (!weaverConfig.channelName) {
      throw Error(`no channel name defined for ${orgName}`);
    }
    return {
      mspId: weaverConfig.mspId,
      networkName: orgName,
      channelName: weaverConfig.channelName,
      discoveryOptions: this.discoveryOptions,
      wallet: await this.getOrgWallet(orgName),
      connectionProfile: this.getConnectionProfile(orgName),
    };
  }

  private getConnectionProfile(orgName: string): object {
    const netConfig = this.getWeaverNetworkConfig(orgName);
    const ccp = JSON.parse(fs.readFileSync(netConfig.connProfilePath, "utf8"));
    return ccp;
  }

  private async getOrgWallet(orgName: string): Promise<Wallet> {
    const walletPath = path.join(this.weaverWalletPath, `wallet-${orgName}`);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    return wallet;
  }

  private getLocalRelayConfig(orgName: string): LocalRelayConfig {
    const netConfig = this.getWeaverNetworkConfig(orgName);
    if (!netConfig.relayEndpoint) {
      throw Error(`no relay endpoint for ${orgName}`);
    }
    return {
      endpoint: netConfig.relayEndpoint,
      useTLS: false,
      tlsCerts: [],
    };
  }

  private getRemoteNetworkConfig(orgName: string): RemoteNetworkConfig {
    const configPath = path.join(
      this.weaverNetConfigPath,
      "remote-network-config.json",
    );
    const configJSON = JSON.parse(fs.readFileSync(configPath).toString());
    if (!configJSON[orgName]) {
      throw Error(
        `Network: ${orgName} does not exist in the config.template.json file at ${configPath}`,
      );
    }
    const netConfig = configJSON[orgName];
    if (!netConfig.channelName) {
      throw Error(`no channel name defined for ${orgName}`);
    }
    if (!netConfig.relayEndpoint) {
      throw Error(`no relay endpoint defined for ${orgName}`);
    }

    return {
      channelName: netConfig.channelName,
      network: orgName,
      relayAddr: netConfig.relayEndpoint,
      e2eConfidentiality: false,
      partyEndPoint: "", // corda-specific
      flowPackage: "", // corda-specific
      networkType: "fabric",
    };
  }

  private getWeaverNetworkConfig(networkId: string): {
    relayEndpoint?: string;
    connProfilePath: string;
    username?: string;
    mspId?: string;
    aclPolicyPrincipalType?: string;
    channelName?: string;
    chaincode?: string;
  } {
    const configPath = path.join(this.weaverNetConfigPath, "config.json");
    const configJSON = JSON.parse(fs.readFileSync(configPath).toString());
    if (!configJSON[networkId]) {
      throw Error(
        `Network: ${networkId} does not exist in the config.template.json file at ${configPath}`,
      );
    }

    const netConfig = configJSON[networkId];
    return netConfig;
  }
}
