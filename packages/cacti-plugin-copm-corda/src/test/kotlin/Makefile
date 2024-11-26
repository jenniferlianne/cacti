WORKSPACE ?= $(shell realpath `pwd`/../../../../../)
VERSION ?= $(shell grep version ../../../package.json | sed -e s/.*\://g | sed -e "s/\"//g" | sed -e "s/,//" | sed -e "s/\s//")
WEAVER_SAMPLE_VERSION=0.4
PACKAGES = localdeps/protos-java-kt-$(VERSION).jar \
 localdeps/copm-corda-$(VERSION).jar \
 localdeps/interop-contracts-$(VERSION).jar \
 localdeps/weaver-sdk-corda-$(VERSION).jar \
 localdeps/contracts-kotlin-$(WEAVER_SAMPLE_VERSION).jar

localdeps/protos-java-kt-$(VERSION).jar: 
	mkdir -p localdeps
	cd $(WORKSPACE)/weaver/common/protos-java-kt && make build
	cp $(WORKSPACE)/weaver/common/protos-java-kt/build/libs/protos-java-kt-*.jar localdeps

localdeps/copm-corda-$(VERSION).jar: 
	mkdir -p localdeps
	cd $(WORKSPACE)/packages/cacti-copm-core/src/main/protos-kt && ./gradlew build
	cp $(WORKSPACE)/packages/cacti-copm-core/src/main/protos-kt/build/libs/copm-corda-*.jar localdeps

localdeps/interop-contracts-$(VERSION).jar: 
	mkdir -p localdeps
	cd $(WORKSPACE)/weaver/core/network/corda-interop-app && make build-local
	cp $(WORKSPACE)/weaver/core/network/corda-interop-app/interop-workflows/build/libs/interop-workflows-*.jar localdeps 
	cp $(WORKSPACE)/weaver/core/network/corda-interop-app/interop-contracts/build/libs/interop-contracts-*.jar localdeps 

localdeps/weaver-sdk-corda-$(VERSION).jar:
	mkdir -p localdeps
	cd $(WORKSPACE)/weaver/sdks/corda && make build
	cp $(WORKSPACE)/weaver/sdks/corda/build/libs/weaver-sdk-corda-*.jar localdeps

localdeps/contracts-kotlin-$(WEAVER_SAMPLE_VERSION).jar:
	mkdir -p localdeps
	cd $(WORKSPACE)/weaver/samples/corda/corda-simple-application && make build-local
	cp $(WORKSPACE)/weaver/samples/corda/corda-simple-application/contracts-kotlin/build/libs/contracts-kotlin-*.jar localdeps
	cp $(WORKSPACE)/weaver/samples/corda/corda-simple-application/workflows-kotlin/build/libs/workflows-kotlin-*.jar localdeps
 
docker-build: 
	cd $(WORKSPACE)/packages/cacti-plugin-copm-corda && DOCKER_BUILDKIT=1 docker build . -f src/test/kotlin/Dockerfile --tag copm-corda

build-image-local: $(PACKAGES) docker-build

clean: 
	rm -rf localdeps
