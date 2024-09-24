DOCKER_IMAGE_NAME ?= cacti-weaver-iin-agent
DOCKER_TAG ?= `cat ./VERSION`
DOCKER_REGISTRY ?= ghcr.io/hyperledger
GIT_URL = https://github.com/hyperledger/cacti/weaver/core/identity-management/iin-agent
DLT_SPECIFIC_DIR ?= .
COMPOSE_ARG ?=

build: .npmrc
	npm install --workspaces=false
	npm run build

build-local: 
	yarn install
	yarn run build

build-image-local: 
	yarn workspaces focus --production
	yarn install --frozen-lockfile 
	yarn run build
	docker build --build-arg BUILD_TAG="local" --build-arg GIT_URL=$(GIT_URL) -t ${DOCKER_IMAGE_NAME}:$(DOCKER_TAG) -f iinagent.local.Dockerfile .  
	docker tag ${DOCKER_IMAGE_NAME}:$(DOCKER_TAG) $(DOCKER_IMAGE_NAME):latest

build-image: .npmrc
	docker build --build-arg BUILD_TAG="remote" --build-arg GIT_URL=$(GIT_URL) -t ${DOCKER_IMAGE_NAME}:$(DOCKER_TAG) -f iinagent.Dockerfile .

check-if-tag-exists:
	!(DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect $(DOCKER_REGISTRY)/$(DOCKER_IMAGE_NAME):$(DOCKER_TAG) > /dev/null)
	
push-image: check-if-tag-exists build-image
	docker tag ${DOCKER_IMAGE_NAME}:$(DOCKER_TAG) $(DOCKER_REGISTRY)/$(DOCKER_IMAGE_NAME):$(DOCKER_TAG)
	docker push $(DOCKER_REGISTRY)/$(DOCKER_IMAGE_NAME):$(DOCKER_TAG)

push-image-latest:
	docker tag ${DOCKER_IMAGE_NAME}:$(DOCKER_TAG) $(DOCKER_REGISTRY)/$(DOCKER_IMAGE_NAME):latest
	docker push $(DOCKER_REGISTRY)/$(DOCKER_IMAGE_NAME):latest

deploy:
	chmod 777 $(DLT_SPECIFIC_DIR)
	docker network create iin || true
	docker compose $(COMPOSE_ARG) up -d

stop:
	docker compose $(COMPOSE_ARG) down

re-deploy: stop deploy
	
test-local: build-local
	npm run test

clean:
	rm -rf node_modules package-lock.json out
	
clean-local:
	rm -rf node_modules package-lock.json out protos-js cacti-weaver-sdk-fabric
