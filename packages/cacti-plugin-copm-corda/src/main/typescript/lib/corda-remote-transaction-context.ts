import { Logger } from "@hyperledger/cactus-common";
import {
  RemoteNetworkConfig,
  LocalRelayConfig,
  DLAccount,
  DLTransactionParams,
  ViewAddress,
  Interfaces as CopmIF,
} from "@hyperledger-cacti/cacti-copm-core";
import { CordaConfiguration } from "./corda-configuration";

export class CordaRemoteTransactionContext
  implements CopmIF.DLRemoteTransactionContext
{
  private cordaConfig: CordaConfiguration;
  private localRelayConfig: LocalRelayConfig;
  private account: DLAccount;
  private interopContractName: string;
  private remoteNetConfig: RemoteNetworkConfig;
  private log: Logger;

  constructor(
    cordaConfig: CordaConfiguration,
    localRelayConfig: LocalRelayConfig,
    account: DLAccount,
    remoteNetworkConfig: RemoteNetworkConfig,

    interopContractName: string,
    log: Logger,
  ) {
    this.cordaConfig = cordaConfig;
    this.localRelayConfig = localRelayConfig;
    this.account = account;
    this.remoteNetConfig = remoteNetworkConfig;
    this.log = log;
    this.interopContractName = interopContractName;
  }

  public async invokeFlow(
    remoteTransactionParams: DLTransactionParams,
    localTransactionParams: DLTransactionParams,
  ): Promise<string> {
    /*
    const contract = await this.connect();
    const keyCert = await this.getKeyAndCertForRemoteRequestByUserName(
      this.localContext.wallet,
      this.account.userId,
    );
    const replaceIndices = localTransactionParams.args.findIndex(
      (element) => element == "",
    );
    let interopFlowResponse;
    this.log.debug(
      `calling flow on relay on network ${this.localContext.networkName} relay: ${this.localRelayConfig.endpoint}`,
    );
    try {
      interopFlowResponse = await InteroperableHelper.interopFlow(
        contract,
        this.localContext.networkName,
        {
          channel: this.localContext.channelName,
          ccFunc: localTransactionParams.method,
          ccArgs: localTransactionParams.args,
          contractName: localTransactionParams.contract,
        },
        this.localContext.mspId,
        this.localRelayConfig.endpoint,
        [replaceIndices],
        [
          {
            address: this.address(remoteTransactionParams),
            Sign: true,
          },
        ],
        keyCert,
        [],
        false,
        this.localRelayConfig.useTLS,
        this.localRelayConfig.tlsCerts,
        this.remoteNetConfig.e2eConfidentiality,
        this.gateway,
      );
    } catch (error) {
      this.log.error(`Error calling interopFlow: ${error}`);
      throw error;
    }
    this.log.info(
      `View from remote network: ${JSON.stringify(
        interopFlowResponse.views[0].toObject(),
      )}. Interop Flow result: ${interopFlowResponse.result || "successful"}`,
    );
    this.log.debug(
      `ViewB64: ${Buffer.from(interopFlowResponse.views[0].serializeBinary()).toString("base64")}`,
    );
    const remoteValue = this.remoteNetConfig.e2eConfidentiality
      ? InteroperableHelper.getResponseDataFromView(
          interopFlowResponse.views[0],
          keyCert.cert.toBytes(),
        )
      : InteroperableHelper.getResponseDataFromView(
          interopFlowResponse.views[0],
        );
    if (remoteValue.contents) {
      this.log.debug(
        `ViewB64Contents: ${Buffer.from(remoteValue.contents).toString("base64")}`,
      );
    }
    await this.disconnect();
    return remoteValue.data;
    */
    return "";
  }

  public async invoke(transactionParams: DLTransactionParams): Promise<string> {
    /*
    const contract = await this.connect();
    const keyCert = await this.getKeyAndCertForRemoteRequestByUserName(
      this.localContext.wallet,
      this.account.userId,
    );

    this.log.debug(
      `contacting local relay ${this.localRelayConfig.endpoint} on network ${this.account.organization} using cert for user ${this.account.userId}`,
    );
    try {
      const viewAddress = this.address(transactionParams);
      this.log.debug(`parameters for get remote view:`);
      this.log.debug(
        `[0] contract [1] ${this.localContext.networkName}, [2] ${this.localContext.mspId} [3] ${this.localRelayConfig.endpoint}`,
      );
      this.log.debug(`view address: ${viewAddress}`);
      const viewResponse = await InteroperableHelper.getRemoteView(
        contract,
        this.localContext.networkName,
        this.localContext.mspId,
        this.localRelayConfig.endpoint,
        {
          address: viewAddress,
          Sign: true,
        },
        keyCert,
        this.localRelayConfig.useTLS,
        this.localRelayConfig.tlsCerts,
      );
      this.log.debug("got remote view");

      const view = viewResponse.view;
      this.log.debug(
        `ViewB64: ${Buffer.from(view.serializeBinary()).toString("base64")}`,
      );
      const remoteValue = this.remoteNetConfig.e2eConfidentiality
        ? InteroperableHelper.getResponseDataFromView(
            view,
            keyCert.cert.toBytes(),
          )
        : InteroperableHelper.getResponseDataFromView(view);
      if (remoteValue.contents) {
        this.log.debug(
          `ViewB64Contents: ${Buffer.from(remoteValue.contents).toString("base64")}`,
        );
      }

      await this.disconnect();
      return remoteValue.data;
    } catch (error) {
      this.log.error(`Error verifying and storing state: ${error}`);
      throw error;
    }
      */
    return "";
  }

  public address(transactionParams: DLTransactionParams) {
    return new ViewAddress(this.remoteNetConfig, transactionParams).toString();
  }
}
