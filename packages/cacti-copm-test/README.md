# @hyperledger-cacti/cacti-copm-test

Test framework for testing the COPM distributed ledger-specific plugins.

## Usage

Tests set up and tear down their own networks.  Setting up a fabric ledger can take 10 minutes or more.  

By default tests on all supported network types (fabric, corda) are run.  

Yarn scripts and environment variables are available to help debug individual tests.

### Yarn Scripts

 - test:pledge - tests pledge/claim
 - test:lock - tests lock/claim
 - test:view - tests remote view
 - dev:stop - stop all running test networks

### Environment Variables

 - COPM_NET_1: the network type of PartyA
 - COPM_NET_2: the network type of PartyB
 - COPM_KEEP_UP: don't tear down the network at the end.  Saves time when re-running the same test.  Use dev:stop to bring the network down, or re-run the test

### Example

COPM_NET_1=corda COPM_NET_2=fabric COPM_KEEP_UP=true yarn run test:pledge

## Development

To add testing for a new distributed ledger, implement the interfaces defined in src/main/typescript/interfaces
  
  - TestAssets:
    - provides methods for 
      - issueing bonds and tokens
      - checking the owner of a bond
      - checking the token balance
  - CopmTester:
    - manages instantiating the ledger-specific plugin
    - defines the parties in a test network (partyA and partyB)
    - for a party in a network:
      - returns the test-assets implementation 
      - returns the gprc client 
  
The CopmTester for a new network type should be returned by the copm-tester-factory function.

In addition, handling for starting and stopping the digital ledger test network should be added to
packages/cacti-copm-test/src/main/typescript/lib/copm-testnetwork.ts

