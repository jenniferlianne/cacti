import {
  LocalRelayConfig,
  RemoteNetworkConfig,
  DLTransactionParams,
} from "../lib/types";

export interface InteropConfiguration {
  getLocalRelayConfig(orgKey: string): LocalRelayConfig;
  getRemoteNetworkConfig(remoteOrgKey: string): RemoteNetworkConfig;
  getRemotePledgeStatusCmd(
    remoteOrgKey: string,
    ValidatedClaimPledgedAssetRequest,
  ): DLTransactionParams;

  interopContractName: string;
}
