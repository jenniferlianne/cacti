WORKSPACE ?= $(shell realpath `pwd`/../../)

# file targets are used as placeholders to ensure that steps are only run once
COPM_TARGET_DIR=$(WORKSPACE)/packages/cacti-copm-test/target
SETUP_TARGET=$(COPM_TARGET_DIR)/corda-setup.txt
LOCK_NETWORK=$(COPM_TARGET_DIR)/corda-lock-network-up.txt
PLEDGE_NETWORK=$(COPM_TARGET_DIR)/corda-pledge-network-up.txt

VERSION=2.0.0
SIMPLEAPP_VERSION=0.4

LOCALDEPS = localdeps/protos-java-kt-$(VERSION).jar localdeps/copm-corda-$(VERSION).jar localdeps/weaver-sdk-corda-$(VERSION).jar \
	localdeps/interop-workflows-$(VERSION).jar localdeps/contracts-kotlin-$(SIMPLEAPP_VERSION).jar

## Build monorepo dependencies and copy to localdeps directory

localdeps/protos-java-kt-$(VERSION).jar: 
	mkdir -p localdeps 
	cd $(WORKSPACE)/weaver/common/protos-java-kt && make build
	cp $(WORKSPACE)/weaver/common/protos-java-kt/build/libs/protos-java-kt-$(VERSION).jar localdeps

localdeps/copm-corda-$(VERSION).jar: 
	cd $(WORKSPACE)/packages/cacti-copm-core/src/main/protos-kt && \
	./gradlew build 
	cp $(WORKSPACE)/packages/cacti-copm-core/src/main/protos-kt/build/libs/copm-corda-$(VERSION).jar localdeps

localdeps/weaver-sdk-corda-$(VERSION).jar:
	cd $(WORKSPACE)/weaver/sdks/corda && make build
	cp $(WORKSPACE)/weaver/sdks/corda/build/libs/weaver-sdk-corda-$(VERSION).jar localdeps

localdeps/interop-workflows-$(VERSION).jar: 
	cd $(WORKSPACE)/weaver/core/network/corda-interop-app && make build-local
	cp $(WORKSPACE)/weaver/core/network/corda-interop-app/interop-workflows/build/libs/interop-workflows-$(VERSION).jar localdeps
	cp $(WORKSPACE)/weaver/core/network/corda-interop-app/interop-contracts/build/libs/interop-contracts-$(VERSION).jar localdeps

localdeps/contracts-kotlin-$(SIMPLEAPP_VERSION).jar: 
	cd $(WORKSPACE)/weaver/samples/corda/corda-simple-application && make build-local
	cp $(WORKSPACE)/weaver/samples/corda/corda-simple-application/contracts-kotlin/build/libs/contracts-kotlin-$(SIMPLEAPP_VERSION).jar localdeps
	cp $(WORKSPACE)/weaver/samples/corda/corda-simple-application/workflows-kotlin/build/libs/workflows-kotlin-$(SIMPLEAPP_VERSION).jar localdeps

# MAIN TARGETS

docker-image: 
	DOCKER_BUILDKIT=1 docker build . --tag copm-corda 

localdeps: $(LOCALDEPS)

$(SETUP_TARGET): localdeps docker-image
	cd $(WORKSPACE)/packages/cacti-copm-test && make corda-setup
	touch $(SETUP_TARGET)

$(PLEDGE_NETWORK): setup 
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	make corda-pledge-dl corda1-driver corda2-driver common-relay-config corda-relay-config corda1-relay corda2-relay corda-cli corda-pledge-cli-setup
	touch $(PLEDGE_NETWORK)

$(LOCK_NETWORK): setup 
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	make corda-lock-dl corda-cli 
	touch $(LOCK_NETWORK

pledge-network: $(PLEDGE_NETWORK) 

lock-network: $(LOCK_NETWORK)

setup: $(SETUP_TARGET)

clean-network:
	cd $(WORKSPACE)/packages/cacti-copm-test && make clean-network 

