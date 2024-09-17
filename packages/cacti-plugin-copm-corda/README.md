# @hyperledger-cacti/cacti-plugin-copm-corda

Implements COPM primitives for Corda as a cacti plugin.  The implementation follows the model of the Corda ledger connector plugin, where a typescript pass-through implementation is registered on the plugin server, and commands are implemented on a separate grpc server in the Kotlin Spring framework.  

Command documentation as OpenAPI:
https://hyperledger-cacti.github.io/cacti/references/openapi/cacti-copm-core_openapi/

The kotlin implementation is divided into a base package, org.hyperledger.cacti.plugin.copm, and a sample implementation, 
com.copmCorda.  The com.copmCorda package specifies the application-specific implementation using the weaver
sample code.

These endpoints require the following:

- weaver relays and drivers to be deployed on the network
- chaincode contracts supporting 'asset exchange' and 'asset transfer' to be deployed on the corda network
  
Please see https://hyperledger-cacti.github.io/cacti/weaver/introduction/.

# Usage

## Installation

Yarn: 

    yarn add --exact @hyperledger-cacti/cacti-plugin-copm-corda

In a production scenario the kotlin server should be deployed and reachable from the cacti server plugin. Please see
Dockerfile in this directory as an example.

## Configuration

The following application-specific interfaces must be implemented:

  - CordaConfiguration - provides information on how local asset contracts and user accounts are configured
  - InteropConfiguration - provides information on how remote networks are configured

These implementations should be marked as Spring components, as shown in the example implementation. 

## Development

A Makefile is provided which will build a docker Corda weaver network with the following commands:

- make setup
  - build all weaver components
- make lock-network
  - makes a network for running lock/claim.  The lock and claim primitives are intended to be used by users on the same network.
- make pledge-network
  - makes a network for running inter-network commands such as pledge/claim. This network includes:
	- 2 corda ledger networks, Corda_Network and Corda_Network2
	- a weaver relay and a driver for each network
- make clean-network
  - tear down the current network
  
