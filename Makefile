SHELL := /bin/bash

.DEFAULT_GOAL := help

.PHONY: help setup start start-logs run devrun build lint format format-fix pretty clean supa-start supa-stop supa-reset supa-status supa-push supa-pull db-start db-stop db-reset docker-dev docker-dev-detached docker-up-detached docker-prod docker-prod-detached docker-down docker-logs docker-prod-build test test-ui

help: ## Show available make targets.
	@echo "Available make targets:"
	@grep -E '^[a-zA-Z0-9_-]+:.*?##' $(MAKEFILE_LIST) | awk 'BEGIN {FS=":.*?## "}{printf "  %-16s %s\n", $$1, $$2}'

run: ## Start Next.js dev server in the background (Supabase must be running separately).
	@mkdir -p .next
	@nohup npm run dev > .next/dev.log 2>&1 & echo $$! > .next/dev.pid
	@echo "Next.js dev server started in the background (PID $$(cat .next/dev.pid))."
	@echo "Logs: .next/dev.log"

build: ## Build the application for production.
	npm run build

# Code Quality

lint: ## Run ESLint and TypeScript checks.
	npm run lint & npm run typecheck

format: ## Check code formatting with Prettier.
	npm run format

# Docker

docker-build: ## Run development environment in Docker with hot reload.
	docker compose -f docker-compose.yaml up --build

docker-up-detached: ## Run development environment in Docker with hot reload (detached).
	docker compose -f docker-compose.yaml up -d

docker-build-detached: ## Run development environment in Docker with hot reload.
	docker compose -f docker-compose.yaml up -d --build

docker-down: ## Stop all Docker containers.
	docker compose -f docker-compose.yaml down

docker-logs: ## Tail Docker logs.
	docker compose -f docker-compose.yaml logs -f

# Cleanup

clean: ## Remove build artifacts and dependencies.
	rm -rf .next node_modules dist build .turbo
	@echo "✓ Cleaned build artifacts"

# tests

# test: ## Run all tests with coverage
# 	npm run test:coverage

# test-ui: ## Run tests with UI
# 	npm run test:ui
