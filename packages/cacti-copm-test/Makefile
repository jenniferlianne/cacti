WORKSPACE ?= $(shell realpath `pwd`/../../)
DOCKER_IMAGES=hyperledger/fabric-orderer hyperledger/fabric-peer hyperledger/fabric-ca ghcr.io/hyperledger/cacti-weaver-iin-agent ghcr.io/hyperledger/cacti-weaver-relay-server ghcr.io/hyperledger/cacti-weaver-driver-fabric corda/community:4.12-zulu-openjdk ghcr.io/hyperledger/cacti-weaver-driver-corda copm-corda
COPM_TARGET_DIR=$(WORKSPACE)/packages/cacti-copm-test/target


# DL-NETWORK ---------------------------------------------------

fabric-dl: 
	export GO111MODULE=auto
	echo "making fabric DL network"
	cd $(WORKSPACE)/weaver/tests/network-setups/fabric/dev && \
	make start-interop-local CHAINCODE_NAME=$(chaincode) PROFILE='2-nodes'

corda-pledge-dl:
	cd $(WORKSPACE)/weaver/tests/network-setups/corda && \
	./scripts/get-cordapps.sh simple local && \
	make start-local

corda-lock-dl:
	cd $(WORKSPACE)/weaver/tests/network-setups/corda && \
	./scripts/get-cordapps.sh  simple local  && \
	make start-network1-local PROFILE=3-nodes

# DRIVERS -----------------------------------------------------

fabric1-driver:
	cd $(WORKSPACE)/weaver/core/drivers/fabric-driver && \
	sed -i "s#<PATH-TO-WEAVER>#$(WORKSPACE)/weaver#g" docker-testnet-envs/.env.n1 &&\
	make deploy COMPOSE_ARG='--env-file docker-testnet-envs/.env.n1' NETWORK_NAME=network1 

fabric2-driver:
	cd $(WORKSPACE)/weaver/core/drivers/fabric-driver && \
	sed -i "s#<PATH-TO-WEAVER>#$(WORKSPACE)/weaver#g" docker-testnet-envs/.env.n2 && \
	make deploy COMPOSE_ARG='--env-file docker-testnet-envs/.env.n2' NETWORK_NAME=network2

corda1-driver:
	echo "starting corda driver 1"
	cd $(WORKSPACE)/weaver/core/drivers/corda-driver && \
	make deploy COMPOSE_ARG='--env-file docker-testnet-envs/.env.corda'

corda2-driver:
	echo "starting corda driver 2"
	cd $(WORKSPACE)/weaver/core/drivers/corda-driver && \
    make deploy COMPOSE_ARG='--env-file docker-testnet-envs/.env.corda2'


# RELAYS ---------------------------------------------------------

common-relay-config:
	cd $(WORKSPACE)/weaver/core/relay && \
	make convert-compose-method2

corda-relay-config:
	cd $(WORKSPACE)/weaver/core/relay &&\
    make protos-local &&\
    cargo update -p nom &&\
    cargo update -p lexical-core

corda1-relay:
	echo "starting corda relay 1"
	cd $(WORKSPACE)/weaver/core/relay &&\
	make start-server COMPOSE_ARG='--env-file docker/testnet-envs/.env.corda' 

corda2-relay:
	echo "starting corda relay 2"
	cd $(WORKSPACE)/weaver/core/relay &&\
    make start-server COMPOSE_ARG='--env-file docker/testnet-envs/.env.corda2'

fabric1-relay:
	cd $(WORKSPACE)/weaver/core/relay && \
	make start-server COMPOSE_ARG='--env-file docker/testnet-envs/.env.n1' 

fabric2-relay:
	cd $(WORKSPACE)/weaver/core/relay && \
	make convert-compose-method2 && \
	make start-server COMPOSE_ARG='--env-file docker/testnet-envs/.env.n2' 

# IIN --------------------------------------------------------------------------------------

iin:
	cd $(WORKSPACE)/weaver/core/identity-management/iin-agent && \
	sed -i "s#<PATH-TO-WEAVER>#$(WORKSPACE)/weaver#g" docker-testnet/envs/.env.n1.org1 && \
	sed -i "s#^AUTO_SYNC=true#AUTO_SYNC=false#g" docker-testnet/envs/.env.n1.org1 && \
	sed -i "s#^DNS_CONFIG_PATH=.*#DNS_CONFIG_PATH=./docker-testnet/configs/dnsconfig-2-nodes.json#g" docker-testnet/envs/.env.n1.org1 && \
	sed -i "s#<PATH-TO-WEAVER>#$(WORKSPACE)/weaver#g" docker-testnet/envs/.env.n1.org2 && \
	sed -i "s#^AUTO_SYNC=true#AUTO_SYNC=false#g" docker-testnet/envs/.env.n1.org2 && \
	sed -i "s#^DNS_CONFIG_PATH=.*#DNS_CONFIG_PATH=./docker-testnet/configs/dnsconfig-2-nodes.json#g" docker-testnet/envs/.env.n1.org2 && \
	sed -i "s#<PATH-TO-WEAVER>#$(WORKSPACE)/weaver#g" docker-testnet/envs/.env.n2.org1 && \
	sed -i "s#^AUTO_SYNC=true#AUTO_SYNC=false#g" docker-testnet/envs/.env.n2.org1 && \
	sed -i "s#^DNS_CONFIG_PATH=.*#DNS_CONFIG_PATH=./docker-testnet/configs/dnsconfig-2-nodes.json#g" docker-testnet/envs/.env.n2.org1 && \
	sed -i "s#<PATH-TO-WEAVER>#$(WORKSPACE)/weaver#g" docker-testnet/envs/.env.n2.org2 && \
	sed -i "s#^AUTO_SYNC=true#AUTO_SYNC=false#g" docker-testnet/envs/.env.n2.org2 && \
	sed -i "s#^DNS_CONFIG_PATH=.*#DNS_CONFIG_PATH=./docker-testnet/configs/dnsconfig-2-nodes.json#g" docker-testnet/envs/.env.n2.org2 && \
	make deploy COMPOSE_ARG='--env-file docker-testnet/envs/.env.n1.org1' DLT_SPECIFIC_DIR=$(WORKSPACE)/weaver/tests/network-setups/fabric/shared/network1/peerOrganizations/org1.network1.com && \
	make deploy COMPOSE_ARG='--env-file docker-testnet/envs/.env.n1.org2' DLT_SPECIFIC_DIR=$(WORKSPACE)/weaver/tests/network-setups/fabric/shared/network1/peerOrganizations/org2.network1.com && \
	make deploy COMPOSE_ARG='--env-file docker-testnet/envs/.env.n2.org1' DLT_SPECIFIC_DIR=$(WORKSPACE)/weaver/tests/network-setups/fabric/shared/network2/peerOrganizations/org1.network2.com && \
	make deploy COMPOSE_ARG='--env-file docker-testnet/envs/.env.n2.org2' DLT_SPECIFIC_DIR=$(WORKSPACE)/weaver/tests/network-setups/fabric/shared/network2/peerOrganizations/org2.network2.com 

# CLI --------------------------------------------------------------------------------------

fabric-cli:
	cd $(WORKSPACE)/weaver/samples/fabric/fabric-cli && \
	./bin/fabric-cli env set MEMBER_CREDENTIAL_FOLDER $(WORKSPACE)/weaver/samples/fabric/fabric-cli/src/data/credentials_docker && \
	./bin/fabric-cli env set CONFIG_PATH $(WORKSPACE)/weaver/samples/fabric/fabric-cli/config.json && \
	./bin/fabric-cli env set DEFAULT_APPLICATION_CHAINCODE $(chaincode) && \
	./bin/fabric-cli env set REMOTE_CONFIG_PATH $(WORKSPACE)/weaver/samples/fabric/fabric-cli/remote-network-config.json && \
	./bin/fabric-cli env set CHAINCODE_PATH $(WORKSPACE)/weaver/samples/fabric/fabric-cli/chaincode.json && \
	cat .env && \
	cp config.template.json config.json && \
	sed -i "s#<PATH-TO-WEAVER>#$(WORKSPACE)/weaver#g" config.json && \
	./bin/fabric-cli config set network2 aclPolicyPrincipalType ca && \
	./bin/fabric-cli config set network1 chaincode $(chaincode) && \
	./bin/fabric-cli config set network2 chaincode $(chaincode) && \
	cp chaincode.json.template chaincode.json && \
	cp remote-network-config.json.template remote-network-config.json && \
	sed -i "s#localhost:9080#relay-network1:9080#g" remote-network-config.json && \
	sed -i "s#localhost:9081#relay-corda:9081#g" remote-network-config.json && \
	sed -i "s#localhost:9082#relay-corda2:9082#g" remote-network-config.json && \
	sed -i "s#localhost:9083#relay-network2:9083#g" remote-network-config.json && \
	sed -i "s#localhost:10006#corda_partya_1:10003#g" remote-network-config.json && \
	sed -i "s#localhost:30006#corda_network2_partya_1:10003#g" remote-network-config.json && \
	./bin/fabric-cli configure create all --local-network=network1 && \
	./bin/fabric-cli configure create all --local-network=network2 && \
	./bin/fabric-cli configure network --local-network=network1 --num-orgs=2 && \
	./bin/fabric-cli configure network --local-network=network2 --num-orgs=2 && \
	./bin/fabric-cli configure membership --local-network=network1 --target-network=network2 --iin-agent-endpoint=localhost:9500 && \
	sleep 30 && \
	docker logs iin-agent-Org1MSP-network1 && \
	docker logs iin-agent-Org1MSP-network2 && \
	./bin/fabric-cli configure membership --local-network=network2 --target-network=network1 --iin-agent-endpoint=localhost:9501 && \
	sleep 30 && \
	docker logs iin-agent-Org1MSP-network1 && \
	docker logs iin-agent-Org1MSP-network2 

corda-cli:
	echo "preparing corda cli"
	cd $(WORKSPACE)/weaver/samples/corda/corda-simple-application/clients/src/main/resources/config && \
	cp remote-network-config.json.template remote-network-config.json && \
	sed -i "s#localhost:9080#relay-network1:9080#g" remote-network-config.json && \
	sed -i "s#localhost:9081#relay-corda:9081#g" remote-network-config.json && \
	sed -i "s#localhost:9082#relay-corda2:9082#g" remote-network-config.json && \
	sed -i "s#localhost:9083#relay-network2:9083#g" remote-network-config.json  && \
	sed -i "s#localhost:10006#corda_partya_1:10003#g" remote-network-config.json  && \
	sed -i "s#localhost:30006#corda_network2_partya_1:10003#g" remote-network-config.json 


corda-pledge-cli-setup:
	cd $(WORKSPACE)/weaver/samples/corda/corda-simple-application &&\
	make initialise-vault-asset-transfer-docker

# MAIN TARGETS

PATH := $(PATH):$(WORKSPACE)/protoc/bin

# SETUP - run once

fabric-setup: 
	cd $(WORKSPACE)/weaver/common/protos-js && make build
	rm -Rf $(WORKSPACE)/weaver/sdks/fabric/interoperation-node-sdk/build
	cd $(WORKSPACE)/weaver/sdks/fabric/interoperation-node-sdk && make build-local
	cd $(WORKSPACE)/weaver/core/identity-management/iin-agent && make build-local build-image-local
	cd $(WORKSPACE)/weaver/samples/fabric/fabric-cli && make build-local 

corda-setup:
	cd $(WORKSPACE)/weaver/common/protos-java-kt && make build
	cd $(WORKSPACE)/weaver/core/network/corda-interop-app && make build-local
	cd $(WORKSPACE)/weaver/sdks/corda && make build
	cd $(WORKSPACE)/weaver/samples/corda/corda-simple-application && make build-local

stop-network:
	cd $(WORKSPACE)/weaver/tests/network-setups/fabric/dev && make stop-network1 stop-network2 PROFILE=2-nodes
	cd $(WORKSPACE)/weaver/tests/network-setups/corda && make stop PROFILE=3-nodes
	cd $(WORKSPACE)/weaver/core/relay && make stop COMPOSE_ARG='--env-file docker/testnet-envs/.env.n1' 
	cd $(WORKSPACE)/weaver/core/relay && make stop COMPOSE_ARG='--env-file docker/testnet-envs/.env.n2' 
	cd $(WORKSPACE)/weaver/core/relay && make stop COMPOSE_ARG='--env-file docker/testnet-envs/.env.corda' 
	cd $(WORKSPACE)/weaver/core/relay && make stop COMPOSE_ARG='--env-file docker/testnet-envs/.env.corda2' 
	cd $(WORKSPACE)/weaver/core/drivers/fabric-driver && make stop COMPOSE_ARG='--env-file docker-testnet-envs/.env.n1' NETWORK_NAME=network1 
	cd $(WORKSPACE)/weaver/core/drivers/fabric-driver && make stop COMPOSE_ARG='--env-file docker-testnet-envs/.env.n2' NETWORK_NAME=network2 
	cd $(WORKSPACE)/weaver/core/drivers/corda-driver && make stop COMPOSE_ARG='--env-file docker-testnet-envs/.env.corda'
	cd $(WORKSPACE)/weaver/core/drivers/corda-driver && make stop COMPOSE_ARG='--env-file docker-testnet-envs/.env.corda2'
	cd $(WORKSPACE)/weaver/core/identity-management/iin-agent && make stop COMPOSE_ARG='--env-file docker-testnet/envs/.env.n1.org1'  
	cd $(WORKSPACE)/weaver/core/identity-management/iin-agent && make stop COMPOSE_ARG='--env-file docker-testnet/envs/.env.n1.org2'  
	cd $(WORKSPACE)/weaver/core/identity-management/iin-agent && make stop COMPOSE_ARG='--env-file docker-testnet/envs/.env.n2.org1'  
	cd $(WORKSPACE)/weaver/core/identity-management/iin-agent && make stop COMPOSE_ARG='--env-file docker-testnet/envs/.env.n2.org2'  
	rm $(COPM_TARGET_DIR)/*network-up.txt || true


define stop_docker
echo "removing $(1)"
docker stop `docker container ls -a -q -f ancestor=$(1) | xargs` || true
docker rm `docker container ls -a -q -f ancestor=$(1) | xargs` || true
endef

clean-network:
	$(foreach image,$(DOCKER_IMAGES),$(call stop_docker,$(image)))
	cd $(WORKSPACE)/weaver/tests/network-setups/fabric/dev && make clean || true
	docker volume prune -f
	docker volume rm  network2_peer0.org2.network2.com || true
	docker volume rm network1_peer0.org2.network1.com || true
	docker network rm corda_default || true
	docker network rm corda_network2_default || true
	docker network rm relay || true
	if [ "$(shell id -un )" != "root" ]; then  \
		sudo chown -R $(shell id -un ) $(WORKSPACE)/weaver/tests/network-setups/fabric/shared; \
		sudo rm -Rf $(WORKSPACE)/weaver/tests/network-setups/corda/dev/*/build || true; \
	fi 
	docker volume rm `docker volume ls | grep -v NAME | sed -e 's/local   //g' | grep -v vscode | xargs` || true
	cd $(WORKSPACE)/weaver/tests/network-setups/corda && make clean || true
	rm $(COPM_TARGET_DIR)/*/*network-up.txt || true
