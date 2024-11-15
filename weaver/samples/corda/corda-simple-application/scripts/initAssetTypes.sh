#!/bin/bash

# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0

## If 'network1' is deployed, initialize its membership
if [[ $(docker ps | grep corda_partya_1 | wc -l) == 1 ]]
then
	./clients/build/install/clients/bin/clients configure asset-types
fi

## If 'network2' is deployed, initialize its membership
if [[ $(docker ps | grep corda_network2_partya_1 | wc -l) == 1 ]]
then
	CORDA_PORT=30006 NETWORK_NAME=Corda_Network2 ./clients/build/install/clients/bin/clients configure asset-types
fi

