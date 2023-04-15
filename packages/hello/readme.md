[![Minimal node version](https://img.shields.io/static/v1?label=node&message=%3E=16.15&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=%3E=8.5.5&logo=npm&color)](https://github.com/npm/cli/releases)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/stephen-shopopop/node-ts/graphs/commit-activity)
[![Linux](https://svgshare.com/i/Zhy.svg)](https://svgshare.com/i/Zhy.svg)
[![macOS](https://svgshare.com/i/ZjP.svg)](https://svgshare.com/i/ZjP.svg)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)

# Simple comme bonjour

## Description

Isoler une dependance, simple comme bonjour

## Analyses

- ✅ facilite de mise en place
- ✅ fonctionnelle
- ✅ tests non necessaire de la librairie (cela reviendrait a tester la dependance)
- ⚠️ complexite pour eviter un couplage trop present avec la dependance
- ⚠️ impossible d'injecter une logique applicative
- ⚠️ la fonction doit etre dupliquée si le projet a besoin de plusieurs instances
- ⛔️ Configuration dans la librairie
- ⛔️ typage pas suffisament strict et ne reponds pas forcement aux besoins
- ⛔️ bien que la librairie n'a pas besoin de test, sont usage peut necessite des tests car le typage n'est pas assez strict. ex: logger.warn(...any[])
- ⛔️ attention a l'usage de methodes specifiques de la dependance

__nota:__ Dans certain cas cette methode est a priviligier, si la dependance ne possede qu´une methode (ou qu´une seul methode soit necessaire au projet) et sans configuration necessaire car elle apporte la simplicite et la facilite de mise en place.


## Contributing

1. npm run start -  Start project
2. npm run dev - Start project with ts-node (dev only)
3. npm run build - Build ts

## Production

```bash
npm i --production
npm start
```

## Docs

### Summary

### Package maintenance

A modern cli tool that keeps your deps fresh

```bash
npx taze
```
