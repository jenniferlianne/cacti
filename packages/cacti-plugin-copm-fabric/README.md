# @hyperledger/cacti-plugin-copm-fabric

This cactus plugin implements a connectRPC server for the fabric COPM implementation.

Command documentation as OpenAPI:
https://jenniferlianne.github.io/cacti/references/openapi/cacti-copm-core_openapi/

These endpoints require the following:

- weaver relays and drivers to be deployed on the network
- chaincode contracts for 'asset exchange' and 'asset transfer' to be deployed on the fabric network
  
Please see https://hyperledger.github.io/cacti/weaver/introduction/.


# Usage

## Installation

Yarn: 

    yarn add --exact @hyperledger/cacti-plugin-copm-fabric


## Configuration

The following application-specific interfaces must be implemented:

-  FabricConfiguration
   -    getConnectionProfile(orgKey: string): object;
   -    getContractContext(orgKey: string): Promise<FabricContractContext>;
   -    getOrgWallet(orgKey: string): Promise<Wallet>;

-  InteropConfiguration (from cacti-copm-common)
   -    getLocalRelayConfig(orgKey: string): LocalRelayConfig;
   -    getRemoteNetworkConfig(remoteOrgKey: string): RemoteNetworkConfig;

  These implementations are then supplied to the plugin constructor. 

  
  