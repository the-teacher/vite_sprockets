.PHONY: build up start compile stop down clean logs shell

# Docker commands
build:
	@echo "Building Docker image..."
	docker-compose -f docker/docker-compose.yml build

up:
	@echo "Starting container in background..."
	docker-compose -f docker/docker-compose.yml up -d

start:
	@echo "Starting container and development server..."
	@make up
	@echo "Installing dependencies..."
	docker-compose -f docker/docker-compose.yml exec vite-app yarn install
	@echo "Starting development server..."
	docker-compose -f docker/docker-compose.yml exec vite-app yarn start

compile:
	@echo "Building production version inside container..."
	docker-compose -f docker/docker-compose.yml exec vite-app yarn build

stop:
	@echo "Stopping container..."
	docker-compose -f docker/docker-compose.yml stop

down:
	@echo "Stopping and removing container..."
	docker-compose -f docker/docker-compose.yml down

clean:
	@echo "Cleaning up Docker resources..."
	docker-compose -f docker/docker-compose.yml down -v --rmi all

logs:
	@echo "Showing container logs..."
	docker-compose -f docker/docker-compose.yml logs -f

shell:
	@echo "Opening shell in container..."
	@make up
	@echo "Installing dependencies..."
	docker-compose -f docker/docker-compose.yml exec vite-app yarn install
	docker-compose -f docker/docker-compose.yml exec vite-app sh

# Development commands
dev:
	@echo "Starting development server inside container..."
	docker-compose -f docker/docker-compose.yml exec vite-app yarn dev --host

install:
	@echo "Installing dependencies inside container..."
	docker-compose -f docker/docker-compose.yml exec vite-app yarn install

# Container status
status:
	@echo "Container status:"
	docker-compose -f docker/docker-compose.yml ps

# Help command
help:
	@echo "Available commands:"
	@echo "  build    - Build Docker image"
	@echo "  up       - Start container in background"
	@echo "  start    - Start container + install deps + run dev server"
	@echo "  compile  - Build production version inside container"
	@echo "  stop     - Stop container"
	@echo "  down     - Stop and remove container"
	@echo "  clean    - Clean up Docker resources"
	@echo "  logs     - Show container logs"
	@echo "  shell    - Open shell in container (with deps installed)"
	@echo "  install  - Install dependencies inside container"
	@echo "  status   - Show container status"
