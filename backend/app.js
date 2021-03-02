const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path'); //path nous donne acces à notre chemin de système de fichier

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_URL}`,// Utilisation de variables d'environnement pour cacher les données sensibles
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');// http://127.0.0.1:4200 on autorise que les requetes localhosts 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());                     //We are telling to the machine that is JSON that we want to use 

//app.use('/images', express.static(path.join(__dirname, 'images')));     // express doit gérer la ressource image de manière static, enregistre et actialise l'application dans le navigateur

app.use('/api/sauces/', sauceRoutes);
app.use('/api/auth/', userRoutes);

module.exports = app; // On exporte cette constante  pour y avoir accées depuis d'autre fichier du projet (server.js)