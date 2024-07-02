rootdir = $(realpath .)
WORKSPACE=$(rootdir)/../../..

dependencies: 
	cd ../common && \
	make js-protos interop-sdk fabric-cli fabric-cli-config fabric-cli-env 

start-fabric-network:
	cd ..//network-setups/fabric/dev && \
	make start-interop-local CHAINCODE_NAME=simpleasset

run-test:
	sh test.sh

build: 	dependencies  
test:  build start-fabric-network run-test
