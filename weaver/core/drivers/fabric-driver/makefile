DOCKER_IMAGE_NAME ?= cacti-weaver-driver-fabric
DOCKER_TAG ?= `cat ./VERSION`
DOCKER_REGISTRY ?= ghcr.io/hyperledger
GIT_URL = https://github.com/hyperledger/cacti/cacti/core/drivers/fabric-driver
NETWORK_NAME ?= network1
COMPOSE_ARG ?=

build-local: 
	yarn install
	yarn run build

build: .npmrc build-local

build-image-local: build-local
	docker build --build-arg BUILD_TAG="local" --build-arg GIT_URL=$(GIT_URL) -t ${DOCKER_IMAGE_NAME}:$(DOCKER_TAG) -f fabricDriver.dockerfile.local .  
	docker tag ${DOCKER_IMAGE_NAME}:$(DOCKER_TAG) $(DOCKER_IMAGE_NAME):latest

build-image: .npmrc
	docker build --build-arg BUILD_TAG="remote" --build-arg GIT_URL=$(GIT_URL) -t ${DOCKER_IMAGE_NAME}:$(DOCKER_TAG) -f fabricDriver.dockerfile .

check-if-tag-exists:
	!(DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect $(DOCKER_REGISTRY)/$(DOCKER_IMAGE_NAME):$(DOCKER_TAG) > /dev/null)
	
push-image: check-if-tag-exists build-image
	docker tag ${DOCKER_IMAGE_NAME}:$(DOCKER_TAG) $(DOCKER_REGISTRY)/$(DOCKER_IMAGE_NAME):$(DOCKER_TAG)
	docker push $(DOCKER_REGISTRY)/$(DOCKER_IMAGE_NAME):$(DOCKER_TAG)

push-image-latest:
	docker tag ${DOCKER_IMAGE_NAME}:$(DOCKER_TAG) $(DOCKER_REGISTRY)/$(DOCKER_IMAGE_NAME):latest
	docker push $(DOCKER_REGISTRY)/$(DOCKER_IMAGE_NAME):latest

deploy:
	mkdir -p wallet-$(NETWORK_NAME) && chmod 777 wallet-$(NETWORK_NAME)
	docker compose $(COMPOSE_ARG) up -d

stop:
	docker compose $(COMPOSE_ARG) down

re-deploy: stop deploy
	
clean:
	rm -rf node_modules package-lock.json out
	
clean-local:
	rm -rf node_modules package-lock.json out protos-js cacti-weaver-sdk-fabric
