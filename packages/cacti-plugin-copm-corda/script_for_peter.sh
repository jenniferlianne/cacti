
#!/bin/bash

echo "ensure you have the prereqs installed from here: https://github.com/jenniferlianne/cacti/blob/copm_corda/.github/actions/copm_test/action.yaml"
read -p "hit any key to continue or cntrl-c to break" anyvar
make setup
make lock-network
yarn run test:lock