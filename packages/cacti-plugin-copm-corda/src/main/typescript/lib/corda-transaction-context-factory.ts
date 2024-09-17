import { Interfaces as CopmIF, DLAccount } from "@hyperledger/cacti-copm-core";
import { CordaConfiguration } from "./corda-configuration";
import { CordaTransactionContext } from "./corda-transaction-context";
import { CordaRemoteTransactionContext } from "./corda-remote-transaction-context";
import { Logger } from "@hyperledger/cactus-common";

export class CordaTransactionContextFactory
  implements CopmIF.DLTransactionContextFactory
{
  private cordaConfig: CordaConfiguration;
  private interopConfiguration: CopmIF.InteropConfiguration;
  private log: Logger;

  constructor(
    cordaConfig: CordaConfiguration,
    interopConfiguration: CopmIF.InteropConfiguration,
    log: Logger,
  ) {
    this.cordaConfig = cordaConfig;
    this.interopConfiguration = interopConfiguration;
    this.log = log;
  }

  public async getTransactionContext(
    account: DLAccount,
  ): Promise<CopmIF.DLTransactionContext> {
    return new CordaTransactionContext(
      this.cordaConfig.getCordaAPI(account),
      account,
      this.log,
    );
  }

  public async getRemoteTransactionContext(
    account: DLAccount,
    remoteNetwork: string,
  ): Promise<CordaRemoteTransactionContext> {
    return new CordaRemoteTransactionContext(
      this.cordaConfig,
      this.interopConfiguration.getLocalRelayConfig(account.organization),
      account,
      this.interopConfiguration.getRemoteNetworkConfig(remoteNetwork),
      this.interopConfiguration.interopContractName,
      this.log,
    );
  }
}
