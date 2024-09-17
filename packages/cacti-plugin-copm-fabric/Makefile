WORKSPACE ?= $(shell realpath `pwd`/../../)

pledge%: chaincode = simpleassettransfer
lock%: chaincode = simpleasset

setup:
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	make fabric-setup

# fabric-fabric test network
.test-network: 
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	chaincode=$(chaincode) make fabric-dl fabric1-driver fabric2-driver common-relay-config fabric1-relay fabric2-relay iin fabric-cli

pledge-network: .test-network 

lock-network: .test-network

clean-network:
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	make clean-network
