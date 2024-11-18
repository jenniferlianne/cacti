WORKSPACE ?= $(shell realpath `pwd`/../../)

COPM_TARGET_DIR=$(WORKSPACE)/packages/cacti-copm-test/target
CORDA_SETUP_TARGET=$(COPM_TARGET_DIR)/corda-setup.txt
CORDA_LOCK_NETWORK_TARGET=$(COPM_TARGET_DIR)/corda-lock-network-up.txt
CORDA_PLEDGE_NETWORK_TARGET=$(COPM_TARGET_DIR)/corda-pledge-network-up.txt

$(CORDA_SETUP_TARGET):
	cd $(WORKSPACE)/packages/cacti-copm-core/src/main/protos-kt && \
	./gradlew build && \
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	make corda-setup
	mkdir -p localdeps && \
	cp $(WORKSPACE)/packages/cacti-copm-core/src/main/protos-kt/build/libs/copm-corda-*jar localdeps 
	cp $(WORKSPACE)/weaver/common/protos-java-kt/build/libs/protos-java-kt-*.jar localdeps
	cp $(WORKSPACE)/weaver/sdks/corda/build/libs/weaver-sdk-corda-*.jar localdeps
	cp $(WORKSPACE)/weaver/core/network/corda-interop-app/interop-workflows/build/libs/interop-workflows-*.jar localdeps
	cp $(WORKSPACE)/weaver/core/network/corda-interop-app/interop-contracts/build/libs/interop-contracts-*.jar localdeps
	cp $(WORKSPACE)/weaver/samples/corda/corda-simple-application/contracts-kotlin/build/libs/contracts-kotlin-*.jar localdeps
	cp $(WORKSPACE)/weaver/samples/corda/corda-simple-application/workflows-kotlin/build/libs/workflows-kotlin-*.jar localdeps
	DOCKER_BUILDKIT=1 docker build . --tag copm-corda 
	mkdir -p $(COPM_TARGET_DIR)
	touch $(CORDA_SETUP_TARGET)

$(CORDA_PLEDGE_NETWORK_TARGET): $(CORDA_SETUP_TARGET) 
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	make corda-pledge-dl corda1-driver corda2-driver common-relay-config corda-relay-config corda1-relay corda2-relay corda-cli corda-pledge-cli-setup
	touch $(CORDA_PLEDGE_NETWORK_TARGET)

$(CORDA_LOCK_NETWORK_TARGET): $(CORDA_SETUP_TARGET) 
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	make corda-lock-dl corda-cli 
	touch $(CORDA_LOCK_NETWORK_TARGET

.PHONY: setup
setup: $(CORDA_SETUP_TARGET)

.PHONY: pledge-network
pledge-network: $(CORDA_PLEDGE_NETWORK_TARGET) 

.PHONY: lock-network
lock-network: $(CORDA_LOCK_NETWORK_TARGET)

.PHONY: clean-network
clean-network:
	cd $(WORKSPACE)/packages/cacti-copm-core && make clean-network 

