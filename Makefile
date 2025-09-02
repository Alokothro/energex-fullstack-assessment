.PHONY: help build up down restart logs test clean install migrate

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build all Docker containers
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: down up ## Restart all services

logs: ## View logs for all services
	docker-compose logs -f

logs-lumen: ## View Lumen API logs
	docker-compose logs -f lumen-api

logs-node: ## View Node cache service logs
	docker-compose logs -f node-cache

logs-frontend: ## View frontend logs
	docker-compose logs -f frontend

test: ## Run all tests
	@echo "Running Lumen tests..."
	docker-compose exec lumen-api vendor/bin/phpunit
	@echo "Running Node.js tests..."
	docker-compose exec node-cache npm test
	@echo "Running Frontend tests..."
	docker-compose exec frontend npm test -- --watchAll=false

test-lumen: ## Run Lumen tests only
	docker-compose exec lumen-api vendor/bin/phpunit

test-node: ## Run Node.js tests only
	docker-compose exec node-cache npm test

test-frontend: ## Run Frontend tests only
	docker-compose exec frontend npm test -- --watchAll=false

clean: ## Clean up containers and volumes
	docker-compose down -v
	rm -rf lumen-api/vendor
	rm -rf node-cache-service/node_modules
	rm -rf frontend/node_modules

install: ## Install all dependencies
	@echo "Installing Lumen dependencies..."
	docker-compose exec lumen-api composer install
	@echo "Installing Node.js dependencies..."
	docker-compose exec node-cache npm install
	@echo "Installing Frontend dependencies..."
	docker-compose exec frontend npm install

migrate: ## Run database migrations
	docker-compose exec lumen-api php artisan migrate

seed: ## Seed the database
	docker-compose exec lumen-api php artisan db:seed

fresh: ## Fresh migration with seed
	docker-compose exec lumen-api php artisan migrate:fresh --seed

shell-lumen: ## Access Lumen container shell
	docker-compose exec lumen-api sh

shell-node: ## Access Node container shell
	docker-compose exec node-cache sh

shell-mysql: ## Access MySQL container
	docker-compose exec mysql mysql -u app_user -papp_password microservice_db

shell-redis: ## Access Redis CLI
	docker-compose exec redis redis-cli

setup: build up ## Initial setup - build and start all services
	@echo "Waiting for services to start..."
	@sleep 10
	@echo "Running migrations..."
	@make migrate
	@echo "Setup complete! Access the application at:"
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - API: http://localhost:8000"
	@echo "  - Cache Service: http://localhost:3001"