WORKSPACE ?= $(shell realpath `pwd`/../../)

# file targets are used as placeholders to ensure that steps are only run once
COPM_TARGET_DIR=$(WORKSPACE)/packages/cacti-copm-test/target
SETUP_TARGET = $(COPM_TARGET_DIR)/fabric-setup.txt
LOCK_NETWORK = $(COPM_TARGET_DIR)/fabric-lock-network-up.txt
PLEDGE_NETWORK = $(COPM_TARGET_DIR)/fabric-pledge-network-up.txt

$(SETUP_TARGET):
	cd $(WORKSPACE)/packages/cacti-copm-test && make fabric-setup
	mkdir -p $(COPM_TARGET_DIR)
	touch $(SETUP_TARGET)

$(LOCK_NETWORK): $(SETUP_TARGET)
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	chaincode=simpleasset make fabric-dl iin fabric-cli
	touch $(LOCK_NETWORK)

$(PLEDGE_NETWORK): $(SETUP_TARGET)
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	chaincode=simpleassettransfer make fabric-dl fabric1-driver fabric2-driver common-relay-config fabric1-relay fabric2-relay iin fabric-cli
	touch $(PLEDGE_NETWORK)

setup: $(SETUP_TARGET)

pledge-network: $(PLEDGE_NETWORK)

lock-network: $(LOCK_NETWORK)

clean-network:
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	make clean-network
