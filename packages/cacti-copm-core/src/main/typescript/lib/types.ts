export type DLTransactionParams = {
  contract: string;
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[];
};

export type DLAccount = {
  organization: string;
  userId: string;
};

export type CopmContractNames = {
  pledgeContract: string;
  lockContract: string;
};

export type RemoteNetworkConfig = {
  channelName: string; // fabric-specific
  chaincode: string; // fabric-specific
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
