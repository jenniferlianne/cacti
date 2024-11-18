WORKSPACE ?= $(shell realpath `pwd`/../../)

COPM_TARGET_DIR=$(WORKSPACE)/packages/cacti-copm-test/target/fabric

$(COPM_TARGET_DIR)/setup.txt:
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	make fabric-setup
	mkdir -p $(COPM_TARGET_DIR)
	touch $(COPM_TARGET_DIR)/setup.txt

$(COPM_TARGET_DIR)/lock-network-up.txt: $(COPM_TARGET_DIR)/setup.txt
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	chaincode=simpleasset make fabric-dl iin fabric-cli
	touch $(COPM_TARGET_DIR)/lock-network-up.txt

$(COPM_TARGET_DIR)/pledge-network-up.txt: $(COPM_TARGET_DIR)/setup.txt
	cd $(WORKSPACE)/packages/cacti-copm-test && \
	chaincode=simpleassettransfer make fabric-dl fabric1-driver fabric2-driver common-relay-config fabric1-relay fabric2-relay iin fabric-cli
	touch $(COPM_TARGET_DIR)/pledge-network-up.txt

setup: $(COPM_TARGET_DIR)/setup.txt

pledge-network: $(COPM_TARGET_DIR)/pledge-network-up.txt

lock-network: $(COPM_TARGET_DIR)/lock-network-up.txt

clean-network:
	cd $(WORKSPACE)/packages/cacti-copm-core && \
	make clean-network
