WORKSPACE ?= $(shell realpath `pwd`/../../)

COPM_TARGET_DIR=$(WORKSPACE)/packages/cacti-copm-test/target/corda

$(COPM_TARGET_DIR)/setup.txt:
	cd $(WORKSPACE)/packages/cacti-copm-core/src/main/protos-kt && \
	./gradlew build && \
	cd $(WORKSPACE)/packages/cacti-copm-core && \
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
	touch $(COPM_TARGET_DIR)/setup.txt

$(COPM_TARGET_DIR)/pledge-network-up.txt: $(COPM_TARGET_DIR)/setup.txt 
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	make corda-pledge-dl corda1-driver corda2-driver common-relay-config corda-relay-config corda1-relay corda2-relay corda-cli corda-pledge-cli-setup
	touch $(COPM_TARGET_DIR)/pledge-network-up.txt

$(COPM_TARGET_DIR)/lock-network-up.txt: $(COPM_TARGET_DIR)/setup.txt 
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	make corda-lock-dl corda-cli 
	touch $(COPM_TARGET_DIR)/lock-network-up.txt

setup: $(COPM_TARGET_DIR)/setup.txt

pledge-network: $(COPM_TARGET_DIR)/pledge-network-up.txt 

lock-network: $(COPM_TARGET_DIR)/lock-network-up.txt	

clean-network:
	cd $(WORKSPACE)/packages/cacti-copm-core && make clean-network 

