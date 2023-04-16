[![Minimal node version](https://img.shields.io/static/v1?label=node&message=%3E=18.15&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=%3E=8.5.5&logo=npm&color)](https://github.com/npm/cli/releases)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/stephen-shopopop/node-ts/graphs/commit-activity)
[![Linux](https://svgshare.com/i/Zhy.svg)](https://svgshare.com/i/Zhy.svg)
[![macOS](https://svgshare.com/i/ZjP.svg)](https://svgshare.com/i/ZjP.svg)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)

# Logger

## Description

Les differentes methodes pour creer une librairie afin d´isoler une dependances et permettre de pouvoir changer de dependances.

## Analyse de cas

Dans ce projet, nous aborderons la construction d´une librairie de log "logger".

__cahier des charges:__

- Nous avons besoin de plusieurs instances de logger dans une application (log de demarrage, log d´erreur, log de debug)
- Chaque instance de logger doit pouvoir s´adapter a son environnement (dev, staging, production).
- Chaque instance de logger doit avoir sa propre configuration
- La librairie logger doit etre securisant a l´usage (typescript)
- La librairie logger ne doit pas etre tester dans la logique metier (la librairie doit etre robuste et posseder ces propres tests)
- La dependance utiliser par la librairie doit pouvoir etre inter-changeable (pino, bunyan, winston, etc...)
- La librairie logger doit correspondre a l'usage et aux besoins (toutes les fonctionnalitees de la dependances ne sont pas forcement necessaire).
- La librairie logger doit etre sans complexite a l´usage (la librairie peut etre complexe mais pas son usage)
- La librairie logger doit pouvoir etre modifier en package si necessaire (usage sur plusieurs services)

__Analyse du besoin:__

Logger bas niveau:

- 2 arguments en entree: une string et un object
- aucun filtre sur les levels d´erreurs remontees
- ex: log demarrage du projet, log sigint, etc...

Logger applicatif:

- Les arguments sont variables et de type non defini
- filtre selon environnement (dev, staging, production)
- filtre sur des donnees sensible
- log envoye vers des outils de telemetrie (logstash, promotheus, etc...)
- les logs ne doivent pas s´afficher sur lancement de test (jest: NODE_ENV=test)

Logger extendError:

- arguments: instance de type Error
- filtre selon environnement (dev, staging, production)
- log envoye uniquement sur le journal du terminal selon level
- les logs ne doivent pas s´afficher sur lancement de test (jest: NODE_ENV=test)

Chaque logger possedent 5 methodes: debug, info, warn, error et fatal. Un filtre pour chacune des methodes.

Chaque logger doit etre identifiable.

Chaque logger doit posseder un horodatage, et une profondeur acceptable sur les objets.

## Methodes

- [simple comme bonjour](/packages/hello)
- [hello the world - poo](/package/logger-poo)

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
