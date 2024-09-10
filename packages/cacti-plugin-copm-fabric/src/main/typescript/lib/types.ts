import { DiscoveryOptions, Wallet } from "fabric-network";

export type DLContractContext = {
  channelName: string;
  mspId: string;
  networkName: string;
  discoveryOptions: DiscoveryOptions;
  connectionProfile: any;
  wallet: Wallet;
};

export type DLTransactionParams = {
  contract: string;
  method: string;
  args: string[];
};

export type CopmContractNames = {
  pledgeContract: string;
  lockContract: string;
};

export type RemoteNetworkConfig = {
  channelName: string;
  network: string;
  relayAddr: string;
  e2eConfidentiality: boolean;
  partyEndPoint: string; // corda-specific
  flowPackage: string; // corda-specific
  networkType: string;
};

export type LocalRelayConfig = {
  endpoint: string;
  useTLS: boolean;
  tlsCerts: string[];
};
