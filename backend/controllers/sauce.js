const Sauce = require('../models/Sauce');
const fs = require('fs');                   //Files System qui permet d'avoir acces à notre systeme de gestion fichiers pour pouvoir suppr les images des things lords des requetes deleteThing

// Pour ajouter un objet dans la base de données
exports.createSauce =  (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,                                      
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userLiked: [],
        userDisliked: []
    });
    sauce.save()                                                        // methode save pour ajouter à la base de données
    .then(() => res.status(201).json({message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));                  // {error} est le racourci de {error: error}
};


exports.modifySauce = (req, res, next) => {
    // deux cas, si il y a une image(donc un req.file) on met aussi l'image à jour, si pas d'image on modifie comme avant la gestion des fichiers images
    const sauceObject = req.file ?              // opérateur ternaire équivalent à:  si req.file existe sinon ....
    {                                           //req.file ? {si exist} : {sinon};
        ...JSON.parse(req.body.sauce), 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`        
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id}, { ... sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

// Supprime un élément de la base de données
exports.deleteSauce = (req, res, next) => {
    
    Sauce.findOne({ _id: req.params.id })                   // on cherche l'objet à suppr
    .then( sauce => {   
        const filename = sauce.imageUrl.split('/images/')[1];// quand on le trouve on extrait le nom du fichier à supprimé
        fs.unlink(`images/${filename}`, () => {                 // fs.unlink pour supprimer le fichier passé en url
            Sauce.deleteOne({ _id: req.params.id })                 //callback: une fois la suppr du fichier effectuer on fait la suppression de l'objet dans la base
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
        });                                            
    })
    .catch(error => res.status(500).json({ error }));
    
};

//Pour séléctionner un objet avec son ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// renvoie tous les objets en vente
exports.getAllSauce = (req, res, next) => {
    Sauce.find()                                                        // methode qui retourne une promise
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};