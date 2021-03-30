#OpenClassRooms Projet 6

# Lien vers repository:

https://github.com/Pertoldi/PertoldiAntoine_6_03022021

Debut du projet le 02/03/2021. 
Il s'agit d'un exercice de la plateforme OpenClassRooms dans le cadre de la formation developpeur web.
Ce projet m'a permi de mettre en place un backend respectant les normes de sécurité en vigueur (OWASP + RGPD).

# Architecture backend: 

le backend est une application express. La base de données utilisé est mongoBD.
Les loguiques métier, les routes et les différents middlewares sont bien structurés dans leur dossier respectif.
Les noeuds nodejs utilisés sont: http(s), express, mongoose, mongoose-unique-validator, path, jwt, fs, helmet, bcrypt, multer.

Le fichier fuzzer.js est un test de fuzzing avorté.

# Mise en place du projet:

Entrer la commande 'ng serve' dans le dossier dwj-project6-master pour lancer le front-end.
Entrer la commande nodemon ./server.js pour lancer le back-end
