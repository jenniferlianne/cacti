.PHONY: build
build: .npmrc
	yarn install
	yarn run build
	
.PHONY: build-local
build-local:
	(cp package.json package-remote.json && \
		cp package-local.json package.json && \
		yarn install) || \
		(mv package-remote.json package.json && exit 1)	# Runs if failure
	mv package-remote.json package.json	                # Runs if success
	yarn run build
	

.PHONE: publish
publish: .npmrc
	npm publish --no-workspaces
	

clean:
	rm -rf build node_modules protos-js package-lock.json .nyc_output coverage
