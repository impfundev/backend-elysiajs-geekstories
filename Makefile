DOCKER_UP=docker-compose up
DOCKER_DOWN = docker-compose down
DOCKER_RESTART = docker-compose restart

deploy:
	sudo ${DOCKER_DOWN} && ${DOCKER_UP} --build && ${DOCKER_RESTART}

createuser:
	sudo bun createuser