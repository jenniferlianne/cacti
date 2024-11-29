WORKSPACE ?= $(shell realpath `pwd`/../../)

COPM_TARGET_DIR=$(WORKSPACE)/packages/cacti-copm-test/target
SETUP_TARGET=$(COPM_TARGET_DIR)/fabric-setup.txt
PLEDGE_TARGET=$(COPM_TARGET_DIR)/fabric-pledge-network-up.txt
LOCK_TARGET=$(COPM_TARGET_DIR)/fabric-lock-network-up.txt

$(SETUP_TARGET):
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	make fabric-setup
	mkdir -p $(COPM_TARGET_DIR)
	touch $(SETUP_TARGET)

$(LOCK_TARGET): $(SETUP_TARGET)
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	chaincode=simpleasset make fabric-dl iin fabric-cli
	touch $(LOCK_TARGET)

$(PLEDGE_TARGET): $(SETUP_TARGET)
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	chaincode=simpleassettransfer make fabric-dl fabric1-driver fabric2-driver common-relay-config fabric1-relay fabric2-relay iin fabric-cli
	touch $(PLEDGE_TARGET)

setup: $(SETUP_TARGET)

pledge-network: $(PLEDGE_TARGET)

lock-network: $(LOCK_TARGET)

clean-network:
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	make clean-network
