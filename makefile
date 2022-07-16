refresh-db:
	docker-compose -f docker/docker-compose.yml rm -v
	docker-compose -f docker/docker-compose.yml build

start-db:
	docker-compose -f docker/docker-compose.yml up