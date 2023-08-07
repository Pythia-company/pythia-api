test:
	npm test
debug:
	docker build -t pythia.api.v1 . && \
	docker run -p 8888:8888 \
	--network docker-network \
	--name pythia.api \
	-it \
	-v $(PWD)/src/controllers:/app/controllers \
	-v $(PWD)/src/models:/app/models \
	-v $(PWD)/src/routes:/app/routes \
	-v $(PWD)/src/server.js:/app/server.js \
	pythia.api.v1:latest
prod:
	docker build -t  pythia.api.v1 . && \
	docker run -p 8888:8888 \
	--name pythia.api \
	-d \
	-v $(PWD)/src/controllers:/app/controllers \
	-v $(PWD)/src/models:/app/models \
	-v $(PWD)/src/routes:/app/routes \
	-v $(PWD)/src/server.js:/app/server.js \
	pythia.api.v1:latest

