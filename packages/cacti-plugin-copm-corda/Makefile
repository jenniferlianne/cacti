WORKSPACE ?= $(shell realpath `pwd`/../../)

pledge%: chaincode = simpleassettransfer
lock%: chaincode = simpleasset

setup:
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	make corda-setup

pledge-network:  
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	make corda-pledge-dl corda1-driver corda2-driver common-relay-config corda-relay-config corda1-relay corda2-relay corda-cli corda-pledge-cli-setup

lock-network:
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	make corda-lock-dl corda-cli

clean-network:
	cd $(WORKSPACE)/packages/cacti-copm-core && make clean-network 

