import {
  LocalRelayConfig,
  RemoteNetworkConfig,
  DLTransactionParams,
} from "../lib/types";
import { ValidatedClaimPledgedAssetRequest } from "../validators/validated_claim_pledged_asset_request";

export interface InteropConfiguration {
  getLocalRelayConfig(orgKey: string): LocalRelayConfig;
  getRemoteNetworkConfig(remoteOrgKey: string): RemoteNetworkConfig;
  getRemotePledgeStatusCmd(
    remoteOrgKey: string,
    ValidatedClaimPledgedAssetRequest,
  ): DLTransactionParams;

  interopContractName: string;
}
