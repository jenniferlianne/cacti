WORKSPACE ?= $(shell realpath `pwd`/../../)

build-local-deps:
	cd $(WORKSPACE)/packages/cacti-copm-core/src/main/protos-kt && \
	./gradlew build && \
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	make setup-corda

setup: build-local-deps
	mkdir -p localdeps && \
	cp $(WORKSPACE)/packages/cacti-copm-core/src/main/protos-kt/build/libs/copm-corda-*jar localdeps 
	cp $(WORKSPACE)/weaver/common/protos-java-kt/build/libs/protos-java-kt-*.jar localdeps
	cp $(WORKSPACE)/weaver/sdks/corda/build/libs/weaver-sdk-corda-*.jar localdeps
	cp $(WORKSPACE)/weaver/core/network/corda-interop-app/interop-workflows/build/libs/interop-workflows-*.jar localdeps
	cp $(WORKSPACE)/weaver/core/network/corda-interop-app/interop-contracts/build/libs/interop-contracts-*.jar localdeps
	cp $(WORKSPACE)/weaver/samples/corda/corda-simple-application/contracts-kotlin/build/libs/contracts-kotlin-*.jar localdeps
	cp $(WORKSPACE)/weaver/samples/corda/corda-simple-application/workflows-kotlin/build/libs/workflows-kotlin-*.jar localdeps

docker-image:
	DOCKER_BUILDKIT=1 docker build . --tag copm-corda 

pledge-network:  
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	make corda-pledge-dl corda1-driver corda2-driver common-relay-config corda-relay-config corda1-relay corda2-relay corda-cli corda-pledge-cli-setup 
	make server

lock-network:
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	make corda-lock-dl corda-cli 
	make server

server: docker-image
	export COPM_CORDA_RPC=`cat ../cacti-copm-test-tooling/corda_rpc.json`
	docker run -e COPM_CORDA_RPC -p 9199:9090 --detach copm-corda 

clean-network:
	cd $(WORKSPACE)/packages/cacti-copm-core && make clean-network 

