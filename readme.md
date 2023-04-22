[![Minimal node version](https://img.shields.io/static/v1?label=node&message=%3E=18.15&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=%3E=8.5.5&logo=npm&color)](https://github.com/npm/cli/releases)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/stephen-shopopop/node-ts/graphs/commit-activity)
[![Linux](https://svgshare.com/i/Zhy.svg)](https://svgshare.com/i/Zhy.svg)
[![macOS](https://svgshare.com/i/ZjP.svg)](https://svgshare.com/i/ZjP.svg)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)
[![CodeQL](https://github.com/stephen-shopopop/logger/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/stephen-shopopop/logger/actions/workflows/github-code-scanning/codeql)
[![pages-build-deployment](https://github.com/stephen-shopopop/logger/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/stephen-shopopop/logger/actions/workflows/pages/pages-build-deployment)
[![Tests](https://github.com/stephen-shopopop/logger/actions/workflows/test.yml/badge.svg)](https://github.com/stephen-shopopop/logger/actions/workflows/test.yml)

# Logger

## Description

Les differentes methodes pour creer une librairie afin d´isoler une dependances.

## Etude de cas

Dans ce projet, nous aborderons la construction d´une librairie de log dit "logger".
La dependance [pino](https://getpino.io) sera utilise a titre d´exemple.

__cahier des charges:__

- Nous avons besoin de plusieurs instances de log dans une application (log de demarrage, log d´erreur, log de debug).
- Chaque instance de log doit pouvoir s´adapter à son environnement (dev, staging, production).
- Chaque instance de log doit avoir sa propre configuration.
- La librairie logger doit etre sécurisant à l´usage (typescript).
- La librairie logger ne doit pas etre testée dans la logique metier (la librairie doit etre robuste et posseder ses propres tests).
- La dependance utilisée par la librairie doit pouvoir être inter-changeable (pino, bunyan, winston, etc...).
- La librairie logger doit correspondre à l'usage et aux besoins (toutes les fonctionnalitées de la dépendances ne sont pas forcement necessaires).
- La librairie logger doit être sans complexité à l´usage (la librairie peut être complexe mais pas son usage).
- La librairie logger doit pouvoir être converti en package (github, npm, etc...) si nécessaire.

__Analyse du besoin:__

Logger bas niveau:

- 2 arguments en entrée: une `string` et un `object`
- aucun filtre sur les levels d´erreurs remontées
- ex: log démarrage du projet, log sigint, etc...

Logger applicatif:

- 2 arguments en entrée: une `string` et un `object`
- filtre sur niveau d´erreur
- filtre sur des données sensibles
- les logs ne doivent pas s´afficher sur lancement de test (jest: NODE_ENV=test)

Logger for class extend Error:

- arguments: instance de type `Error`
- filtre selon environnement (dev, staging, production)
- filtre sur niveau d'erreur
- les logs ne doivent pas s´afficher sur lancement de test (jest: NODE_ENV=test)

La librairie "logger" doit posséder:

- 5 methodes: debug, info, warn, error et fatal. 
- Un filtre sur le niveau d´erreur: debug, info, warn, error et fatal.
- Doit être identifiable via un label.
- Doit posséder un horodatage et une profondeur acceptable sur les objets.
- Doit avoir des logs comprehensible par un developpeur

## Methodes

- [simple comme bonjour](https://github.com/stephen-shopopop/logger/tree/main/packages/hello) - programmation imperative
- [hello the world - poo](https://github.com/stephen-shopopop/logger/tree/main/packages/logger-poo) - programmation orienté objet

## Installation nodejs via nvm (node version manager)

- [macos/linux](https://github.com/nvm-sh/nvm) or use Makefile command: ```make nvm```
- [windows](https://github.com/coreybutler/nvm-windows)

## Contributing

1. npm run lint - Lint your code.
2. npm run lint:fix - Lint & fix your code.

## Install package

```bash
npm install <package> --workspace=<workspace>
```

## Production

```bash
nvm use

npm run build

// run with ts-node
npm run dev

npm start

npm test

npm run clean

npm run maintenance

```

### Package maintenance

A modern cli tool that keeps your deps fresh

```bash
npx taze -r

// major
npx taze major -r
```
