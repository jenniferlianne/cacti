rootdir = $(realpath .)
WORKSPACE=$(rootdir)/../../..

interop-sdk:
	cd ${WORKSPACE}/weaver/sdks/fabric/interoperation-node-sdk && \
	make build-local

js-protos:
	cd ${WORKSPACE}/weaver/common/protos-js && \
	export PATH="${PATH}:${WORKSPACE}/protoc/bin" && \
	git config --global --add safe.directory /weaver/common/fabric-protos && \
	make build

fabric-cli:
	cd ${WORKSPACE}/weaver/samples/fabric/fabric-cli && \
	make build-local 
	
fabric-cli-config:
	cd ${WORKSPACE}/weaver/samples/fabric/fabric-cli && \
	cp config.template.json config.json &&\
	sed -i "s#<PATH-TO-WEAVER>#${WORKSPACE}/weaver#g" config.json  
	
fabric-cli-env:
	cd ${WORKSPACE}/weaver/samples/fabric/fabric-cli && \
	cp .env.template .env &&\
	./bin/fabric-cli config set-file ${WORKSPACE}/weaver/samples/fabric/fabric-cli/config.json &&\
	./bin/fabric-cli env set MEMBER_CREDENTIAL_FOLDER ${WORKSPACE}/weaver/samples/fabric/fabric-cli/src/data/credentials_docker &&\
	./bin/fabric-cli env set CONFIG_PATH ${WORKSPACE}/weaver/samples/fabric/fabric-cli/config.json &&\
	./scripts/initAsset.sh


