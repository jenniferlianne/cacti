rootdir = $(realpath .)
WORKSPACE=$(rootdir)/../../..

dependencies: 
	cd ../common && \
	make js-protos interop-sdk fabric-cli 

start-fabric-network:
	cd ..//network-setups/fabric/dev && \
	make start-interop-local CHAINCODE_NAME=simpleasset

fabric-cli-setup: 
	cd ../common && \
	make fabric-cli-config fabric-cli-env 

run-test:
	sh test.sh

build: 	dependencies  
test:  build start-fabric-network fabric-cli-setup run-test
