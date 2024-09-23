.PHONY: build
build: .npmrc
	yarn install
	yarn run build
	
.PHONY: build-local
build-local:
	yarn install
	yarn run build	

.PHONE: publish
publish: .npmrc
	npm publish --no-workspaces
	

clean:
	rm -rf build node_modules protos-js package-lock.json .nyc_output coverage
