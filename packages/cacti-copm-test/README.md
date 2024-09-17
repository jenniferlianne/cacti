# @hyperledger-cacti/cacti-copm-test

Test framework for testing the COPM distributed ledger-specific plugins.

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

