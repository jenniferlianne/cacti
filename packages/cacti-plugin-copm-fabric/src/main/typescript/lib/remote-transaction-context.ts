import { Logger } from "@hyperledger/cactus-common";
import {
  DLContractContext,
  RemoteNetworkConfig,
  LocalRelayConfig,
  DLTransactionParams,
} from "./types";
import { InteroperableHelper } from "@hyperledger/cacti-weaver-sdk-fabric";
import { Gateway, Contract } from "fabric-network";
import { ViewAddress } from "./view-address";
import { ICryptoKey, Utils } from "fabric-common";

export class RemoteTransactionContext {
  private localContext: DLContractContext;
  private localRelayConfig: LocalRelayConfig;
  private orgName: string;
  private userId: string;
  private interopContractName: string;
  private remoteNetConfig: RemoteNetworkConfig;
  private gateway: Gateway;
  private log: Logger;
  private views: {
    address: string;
    view: any;
  }[];

  constructor(
    localContext: DLContractContext,
    localRelayConfig: LocalRelayConfig,
    orgName: string,
    userId: string,
    remoteNetworkConfig: RemoteNetworkConfig,
    interopContractName: string,
    log: Logger,
  ) {
    this.localContext = localContext;
    this.localRelayConfig = localRelayConfig;
    this.orgName = orgName;
    this.remoteNetConfig = remoteNetworkConfig;
    this.log = log;
    this.userId = userId;
    this.views = [];
    this.interopContractName = interopContractName;
    this.gateway = new Gateway();
  }

  public async invokeFlow(
    remoteTransactionParams: DLTransactionParams,
    localTransactionParams: DLTransactionParams,
  ): Promise<string> {
    const contract = await this.connect();
    const keyCert = await this.getKeyAndCertForRemoteRequestbyUserName(
      this.localContext.wallet,
      this.userId,
    );
    const invokeObject = {
      channel: this.localContext.channelName,
      ccFunc: localTransactionParams.method,
      ccArgs: localTransactionParams.args,
      contractName: localTransactionParams.contract,
    };
    const replaceIndices = localTransactionParams.args.findIndex(
      (element) => element == "",
    );
    let interopFlowResponse;
    this.log.info(`calling flow on relay ${this.localRelayConfig.endpoint}`);
    try {
      interopFlowResponse = await InteroperableHelper.interopFlow(
        contract,
        this.localContext.networkName,
        invokeObject,
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
  }

  public async invoke(transactionParams: DLTransactionParams): Promise<string> {
    const contract = await this.connect();
    const keyCert = await this.getKeyAndCertForRemoteRequestbyUserName(
      this.localContext.wallet,
      this.userId,
    );

    this.log.debug(
      `contacting local relay ${this.localRelayConfig.endpoint} on network ${this.orgName} using cert for user ${this.userId}`,
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
      this.views.push({ address: viewAddress, view: view });
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
  }

  public async verify(): Promise<boolean> {
    const contract = await this.connect();
    this.log.debug(`verifying ${this.views.length} views`);

    for (const viewResponse of this.views) {
      this.log.debug(`calling verif view for view ${viewResponse.address}`);
      const verificationResponse = await InteroperableHelper.verifyView(
        contract,
        Buffer.from(viewResponse.view.serializeBinary()).toString("base64"),
        viewResponse.address,
      );
      if (!verificationResponse) {
        throw Error(`View not verified: ${viewResponse.address}`);
      }
    }

    this.disconnect();
    return true;
  }

  public address(transactionParams: DLTransactionParams) {
    return new ViewAddress(this.remoteNetConfig, transactionParams).toString();
  }

  private disconnect() {
    this.gateway.disconnect();
    this.gateway = new Gateway();
  }

  private async connect(): Promise<Contract> {
    const identity = await this.localContext.wallet.get(this.userId);
    if (!identity) {
      throw new Error(
        `An identity for the user "${this.userId}" does not exist in the wallet for network "${this.orgName}"`,
      );
    }

    // Create a new gateway for connecting to our peer node.
    await this.gateway.connect(this.localContext.connectionProfile, {
      wallet: this.localContext.wallet,
      identity: identity,
      discovery: this.localContext.discoveryOptions,
    });

    const network = await this.gateway.getNetwork(
      this.localContext.channelName,
    );
    // Get the contract from the network.
    return network.getContract(this.interopContractName);
  }

  private async getKeyAndCertForRemoteRequestbyUserName(
    wallet: any,
    username: string,
  ): Promise<{ key: ICryptoKey; cert: any }> {
    if (!wallet) {
      throw new Error("No wallet passed");
    }
    if (!username) {
      throw new Error("No username passed");
    }
    const identity = await wallet.get(username);
    if (!identity) {
      throw new Error(
        "Identity for username " + username + " not present in wallet",
      );
    }
    // Assume the identity is of type 'fabric-network.X509Identity'
    const privKey = Utils.newCryptoSuite().createKeyFromRaw(
      identity.credentials.privateKey,
    );
    return { key: privKey, cert: identity.credentials.certificate };
  }
}
