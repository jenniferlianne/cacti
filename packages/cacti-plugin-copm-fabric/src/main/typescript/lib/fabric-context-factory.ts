import { FabricRemoteTransactionContext } from "./fabric-remote-transaction-context";
import { FabricConfiguration } from "./fabric-configuration";
import { DLTransactionContext } from "./dl-transaction-context";
import { DLTransactionContextFactory } from "./dl-context-factory";
import { InteropConfiguration } from "./interop-configuration";
import { DLAccount } from "./types";
import { Logger } from "@hyperledger/cactus-common";
import { FabricTransactionContext } from "./fabric-transaction-context";

export class FabricContextFactory implements DLTransactionContextFactory {
  private fabricConfiguration: FabricConfiguration;
  private interopConfiguration: InteropConfiguration;
  private log: Logger;

  constructor(
    fabricConfiguration: FabricConfiguration,
    interopConfiguration: InteropConfiguration,
    log: Logger,
  ) {
    this.fabricConfiguration = fabricConfiguration;
    this.interopConfiguration = interopConfiguration;
    this.log = log;
  }

  public async getTransactionContext(
    account: DLAccount,
  ): Promise<DLTransactionContext> {
    const context = await this.fabricConfiguration.getContractContext(
      account.organization,
    );
    return new FabricTransactionContext(context, account, this.log);
  }

  public async getRemoteTransactionContext(
    account: DLAccount,
    remoteNetwork: string,
  ): Promise<FabricRemoteTransactionContext> {
    return new FabricRemoteTransactionContext(
      await this.fabricConfiguration.getContractContext(account.organization),
      this.interopConfiguration.getLocalRelayConfig(account.organization),
      account,
      this.interopConfiguration.getRemoteNetworkConfig(remoteNetwork),
      this.interopConfiguration.interopContractName,
      this.log,
    );
  }
}
