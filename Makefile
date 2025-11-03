DOCKER_UP=docker-compose up
DOCKER_DOWN = docker-compose down
DOCKER_RESTART = docker-compose restart

deploy:
	sudo ${DOCKER_DOWN} && ${DOCKER_UP} && ${DOCKER_RESTART}