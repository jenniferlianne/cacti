build:
	yarn install

build-local: build

build-image:
	docker build -t fabric-cli:latest .
	
clean:
	rm -rf node_modules 
	rm -rf build || true

