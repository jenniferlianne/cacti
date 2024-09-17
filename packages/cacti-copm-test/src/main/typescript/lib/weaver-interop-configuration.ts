import { Logger } from "@hyperledger/cactus-common";
import {
  LocalRelayConfig,
  RemoteNetworkConfig,
  Interfaces as CopmIF,
  DLTransactionParams,
  Validators,
} from "@hyperledger-cacti/cacti-copm-core";
import path from "path";
import fs from "fs-extra";

export class WeaverInteropConfiguration implements CopmIF.InteropConfiguration {
  private log: Logger;
  private weaverRelativePath = "../../../../../../weaver/";
  private weaverNetConfigPath = path.join(
    __dirname,
    this.weaverRelativePath,
    "samples/fabric/fabric-cli",
  );

  interopContractName: string;

  public constructor(interopContractName: string, log: Logger) {
    this.log = log;
    this.interopContractName = interopContractName;
  }

  public getLocalRelayConfig(orgName: string): LocalRelayConfig {
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

  public getRemoteNetworkConfig(orgName: string): RemoteNetworkConfig {
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
    if (!netConfig.relayEndpoint) {
      throw Error(`no relay endpoint defined for ${orgName}`);
    }

    if (netConfig.type === "fabric") {
      if (!netConfig.channelName) {
        throw Error(`no channel name defined for ${orgName}`);
      }

      if (!netConfig.chaincode) {
        throw Error(`no chaincode defined for ${orgName}`);
      }
      return {
        channelName: netConfig.channelName,
        chaincode: netConfig.chaincode,
        network: orgName,
        relayAddr: netConfig.relayEndpoint,
        e2eConfidentiality: false,
        partyEndPoint: "", // corda-specific
        flowPackage: "", // corda-specific
        networkType: netConfig.type,
      };
    } else {
      if (!netConfig.partyEndPoint) {
        throw Error(`no partyEndpoint defined for ${orgName}`);
      }
      if (!netConfig.flowPackage) {
        throw Error(`no flowPackage defined for ${orgName}`);
      }

      return {
        channelName: "",
        chaincode: "",
        network: orgName,
        relayAddr: netConfig.relayEndpoint,
        e2eConfidentiality: false,
        partyEndPoint: netConfig.partyEndPoint, // corda-specific
        flowPackage: netConfig.flowPackage, // corda-specific
        networkType: netConfig.type,
      };
    }
  }

  public getRemotePledgeStatusCmd(
    remoteOrgKey: string,
    claimRequest: Validators.ValidatedClaimPledgedAssetRequest,
  ): DLTransactionParams {
    const remoteNetConfig = this.getRemoteNetworkConfig(remoteOrgKey);
    if (remoteNetConfig.networkType === "corda") {
      return {
        contract: remoteNetConfig.flowPackage || "",
        method: claimRequest.asset.isNFT()
          ? "GetBondAssetPledgeStatusByPledgeId"
          : "GetAssetPledgeStatusByPledgeId",
        args: [claimRequest.pledgeId, claimRequest.destAccount.organization],
      };
    } else {
      return {
        contract: remoteNetConfig.chaincode || "",
        method: claimRequest.asset.isNFT()
          ? "GetAssetPledgeStatus"
          : "GetTokenAssetPledgeStatus",
        args: [
          claimRequest.pledgeId,
          claimRequest.sourceCert,
          claimRequest.destAccount.organization,
          claimRequest.destCert,
        ],
      };
    }
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
