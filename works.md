## Etude de cas: logger

Les differentes methodes pour creer une librairie afin d´isoler une dependances.

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

## Logger les méthodes

- [hello the world - poo](https://github.com/stephen-shopopop/logger/tree/main/packages/logger-poo) - programmation orienté objet
- [hello the world - functionnal](https://github.com/stephen-shopopop/logger/tree/main/packages/logger-functionnal) - programmation fonctionnelle
