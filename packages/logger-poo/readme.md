[![Minimal node version](https://img.shields.io/static/v1?label=node&message=>=18.15.0&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=>=8.5.5&logo=npm&color)](https://github.com/npm/cli/releases)
[![Linux](https://svgshare.com/i/Zhy.svg)](https://svgshare.com/i/Zhy.svg)
[![macOS](https://svgshare.com/i/ZjP.svg)](https://svgshare.com/i/ZjP.svg)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)

# Hello the world - poo

## Description

Isoler une dependance, simple comme bonjour tout le monde - programmation orienté objet

## Analyse

Description | Status | Détails
 ---: | :---: | :---
5 méthodes: debug, info, warn, error, fatal | yes | -
Multi-instance du logger | yes | classe LoggerWrapper
Filtre niveau d´erreur | yes | configuration disponible
Label sur logger | yes | configuration disponible
Filtre données sensible | yes | configuration disponible
Pretty log pour développeur | yes | configuration disponible sur variable d´environnement
Filtre log sur execution de tests | yes | -
Typage de l'utilisation | yes | 2 niveaux correspondant aux besoins
Profondeur objects | yes | -
Horodatage | yes | -
Isolation de la dependance | yes | -
Dépendance inter-changeable | yes | la librairie est découplé de l´usage
Conversion en package | yes | -
Facilité d´usage | yes | -
Usage cadré repondant aux besoins | yes | -
Qualité et test de la librairie | yes | Ecriture de tests obligatoire pour valider le besoin

## Conclusion

- ✅ facilite d'usage
- ✅ fonctionnelle
- ✅ dépendance isolée
- ✅ tests de la librairie
- ✅ typage strict
- ✅ configuration bien isoler
- ✅ configuration a chaud
- ✅ possibilite d'instancier un nouveau logger
- ✅ filtre des donnees sensible
- ✅ label du logger pour une analyse simplifier

La librairie offre un chargement de la configuration à chaud, ainsi le logger peut être utilisé dans n´importe quel autre package et la configuration implémenter dans le service sera effective pour l´ensemble des appels du logger. Disponible uniquement sur logger par defaut "logger".

## Contributing

1. npm run start -  Start project
2. npm run dev - Start project with ts-node (dev only)
3. npm run build - Build ts
