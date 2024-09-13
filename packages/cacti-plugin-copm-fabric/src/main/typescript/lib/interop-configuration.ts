import { LocalRelayConfig, RemoteNetworkConfig } from "./types";

export interface InteropConfiguration {
  getLocalRelayConfig(orgKey: string): LocalRelayConfig;
  getRemoteNetworkConfig(remoteOrgKey: string): RemoteNetworkConfig;
  interopContractName: string;
}
