#!make
PROJECT ?= $(shell node -p "require('./package.json').name")
NVM = v0.39.3
NODE ?= $(shell cat $(PWD)/.nvmrc 2> /dev/null || echo v16.15.0)

.PHONY: help all build install nvm test lint typecheck release git-hooks gen tags task

default: help

# show this help
help:
	@echo 'usage: make [target] ...'
	@echo ''
	@echo 'targets:'
	@grep -E '^[a-z.A-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run: ## NPM install
	. $(NVM_DIR)/nvm.sh && nvm use $(NODE) && $(CMD)

all: ## Run build, lint, typecheck and test for all packages
	make lint typecheck test build

install: ## Install node version
	. $(NVM_DIR)/nvm.sh && nvm install $(NODE)
	make run CMD="npm install"

build: ## Compile typescript
	make run CMD="npm run build"

test: ## Run tests
	make run CMD="npm test"

lint: ## Run linter
	make run CMD="npm run lint"

typecheck: ## Run typecheck
	make run CMD="npm run typecheck"

git-hooks: ## Install git hooks
	make run CMD="npx simple-git-hooks"

gen: ## Generate packages child
	make run CMD="node generate.js"

## Tasks
## ex: make task lint
task: ## Run task
	make run CMD="npm run $(filter-out $@,$(MAKECMDGOALS))"

nvm: ## Install nvm: restart your terminal after nvm install
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${NVM}/install.sh | bash

tags: # Npm version with push
	make run CMD="npm version $(filter-out $@,$(MAKECMDGOALS))"
	git push --follow-tags
