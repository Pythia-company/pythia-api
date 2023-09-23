test:
	npm test
run:
	node src/server.js
debug:
	docker build -t pythia.api.v1 . && \
	docker run -p 8888:8888 \
	--network docker-network \
	--name pythia.api \
	-it \
	--restart always \
	pythia.api.v1:latest
prod:
	docker build -t pythia.api.v1 . && \
	docker run --rm -p 8888:8888 \
	--network docker-network \
	--name pythia.api \
	-d \
	-v $(PWD)/src/controllers:/app/controllers \
	-v $(PWD)/src/models:/app/models \
	-v $(PWD)/src/routes:/app/routes \
	-v $(PWD)/src/server.js:/app/server.js \
	--restart always \
	pythia.api.v1:latest
