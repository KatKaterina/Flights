install: install-deps

install-deps:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack
lint:
	npx eslint . --ext js,jsx

publish:
	npm publish

test:
	npm test -s

.PHONY: test
