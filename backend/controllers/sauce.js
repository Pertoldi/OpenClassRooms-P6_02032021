const Sauce = require('../models/Sauce');
const fs = require('fs');

// Pour ajouter un objet dans la base de données
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);

	//CONTROL FORM
	let messageError = "";
	let isOk = true;
	let checkSpecialCaractere = /^[^@&"'`~^#{}<>_=\[\]\\()/§$£€*\+]+$/;
	let checkOneOrTwoNumber = /^[0-9]{1,2}$/;
	if (!checkSpecialCaractere.test(sauceObject.name)) {
		isOk = false;
		messageError = "Name invalide !";
	} else if (!checkSpecialCaractere.test(sauceObject.manufacturer)) {
		isOk = false;
		messageError = "Manufacturer invalide !";
	} else if (!checkSpecialCaractere.test(sauceObject.description)) {
		isOk = false;
		messageError = "Description invalide !";
	} else if (!checkSpecialCaractere.test(sauceObject.mainPepper)) {
		isOk = false;
		messageError = "MainPepper invalide !";
	} else if (!checkOneOrTwoNumber.test(sauceObject.heat)) {
		isOk = false;
		messageError = "Heat is not a number";
	} else if (!checkSpecialCaractere.test(sauceObject.userId)) {
		isOk = false;
		messageError = "UserId invalid";
	}

	if (isOk) {
		//LOGIQUE METIER
		const sauce = new Sauce({
			...sauceObject,
			imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
			likes: 0,
			dislikes: 0,
			userLiked: [],
			userDisliked: []
		});
		sauce.save()
			.then(() => res.status(201).json({ message: 'Objet enregistré !' }))
			.catch(error => res.status(400).json({ error }));
	} else {
		res.status(400).json({ error: messageError });
	}
};


exports.modifySauce = (req, res, next) => {
	//CONTROL FORM
	let messageError = "";
	let isOk = true;
	let checkSpecialCaractere = /^[^@&"'`~^#{}<>_=\[\]\\()/§$£€*\+]+$/;
	let checkOneOrTwoNumber = /^[0-9]{1,2}$/;

	const tempBody = JSON.parse(req.body.sauce);

	if (!checkSpecialCaractere.test(tempBody.name)) {
		isOk = false;
		messageError = "Name invalide !";
	} else if (!checkSpecialCaractere.test(tempBody.manufacturer)) {
		isOk = false;
		messageError = "Manufacturer invalide !";
	} else if (!checkSpecialCaractere.test(tempBody.description)) {
		isOk = false;
		messageError = "Description invalide !";
	} else if (!checkSpecialCaractere.test(tempBody.mainPepper)) {
		isOk = false;
		messageError = "MainPepper invalide !";
	} else if (!checkOneOrTwoNumber.test(tempBody.heat)) {
		isOk = false;
		messageError = "Heat is not a number";
	} else if (!checkSpecialCaractere.test(tempBody.userId)) {
		isOk = false;
		messageError = "UserId invalid";
	}

	if (isOk) {
		//LOGIQUE METIER
		const sauceObject = req.file ?
			{
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
			} : { ...req.body };
		
		//On supprime l'ancienne image(si elle est mise à jour) avant de mettre à jour la sauce.
		if(req.file) {
			Sauce.findOne({ _id: req.params.id })
			.then(sauce => {
				oldImg = sauce.imageUrl.split('/images/')[1];
				fs.unlink(`images/${oldImg}`, (err) => {
					if (err) throw err;
					console.log('Old image -> successfully deleted !');
				});
			})
			.catch();
		}

		Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
			.then(() => res.status(200).json({ message: 'Objet modifié !' }))
			.catch(error => res.status(400).json({ error }));
	} else {
		res.status(400).json({ error: messageError });
	}

};

// Supprime un élément de la base de données
exports.deleteSauce = (req, res, next) => {

	Sauce.findOne({ _id: req.params.id })                   // on cherche l'objet à suppr
		.then(sauce => {
			const filename = sauce.imageUrl.split('/images/')[1];// quand on le trouve on extrait le nom du fichier à supprimé
			fs.unlink(`images/${filename}`, () => {                 // fs.unlink pour supprimer le fichier passé en url
				Sauce.deleteOne({ _id: req.params.id })                 //callback: une fois la suppr du fichier effectuer on fait la suppression de l'objet dans la base
					.then(() => res.status(200).json({ message: 'Objet supprimé !' }))
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
	Sauce.find()
		.then(sauces => res.status(200).json(sauces))
		.catch(error => res.status(400).json({ error }));
};

exports.likeDislikeSauce = (req, res, next) => {
	let userId = req.body.userId;
	let likeDislike = req.body.like;
	let sauceId = req.params.id;

	let checkSpecialCaractere = /^[^@&"'`~^#{}<>_=\[\]\\()!:;,?./§$£€*\+]+$/;
	let isOk = true;
	let messageError = "";

	//CONTROL FORM
	// si likeDislike != 1, 0, -1 -> switch défault
	if (!checkSpecialCaractere.test(userId)) {
		isOk = false;
		messageError = "UserId invalid";
	} else if (!checkSpecialCaractere.test(sauceId)) {
		isOk = false;
		messageError = "SauceId invalide !";
	}

	if (isOk) {
		//LOGIQUE METIER
		Sauce.findOne({ _id: sauceId })
			.then(sauce => {
				switch (likeDislike) {
					case 1:
						if (sauce.usersLiked.includes(userId)) {
							res.status(200).json({ "message": "Sauce déjà like !" });
							break;
						} else {
							let sauceLikes = sauce.likes + 1;           // Ajout de 1 aux likes
							let sauceUsersLiked = sauce.usersLiked;
							sauceUsersLiked.push(userId);               // Ajout de l'id dans la liste userLiked

							Sauce.updateOne({ _id: sauceId },
								{
									likes: sauceLikes,
									usersLiked: sauceUsersLiked
								}
							)
								.then(res.status(200).json({ "message": "Sauce liké !" }))
								.catch(error => res.status(404).json({ error }));
						}
						break;

					case -1:
						if (sauce.usersDisliked.includes(userId)) {
							res.status(200).json({ "message": "Sauce déjà dislike !" });
							break;
						} else {
							let sauceDislikes = sauce.dislikes + 1;             // Ajout de 1 aux dislikes
							let sauceUsersDisliked = sauce.usersDisliked;
							sauceUsersDisliked.push(userId);                    // Ajout de l'id dans la liste

							Sauce.updateOne({ _id: sauceId },
								{
									dislikes: sauceDislikes,
									usersDisliked: sauceUsersDisliked
								}
							)
								.then(res.status(200).json({ "message": "Sauce disliké !" }))
								.catch(error => res.status(404).json({ error }));
						}
						break;

					case 0:
						if (sauce.usersLiked.includes(userId)) {
							let sauceLikes = sauce.likes;
							sauceLikes += -1; // On retire le like
							let sauceUsersLiked = sauce.usersLiked;

							for (let i = 0; i < sauceUsersLiked.length; i++) {      //methode indexOf ne marche pas
								if (sauceUsersLiked[i] == userId) {
									var index = i
								}
							}

							sauceUsersLiked.splice(index, 1);
							Sauce.updateOne({ _id: sauceId },
								{
									likes: sauceLikes,
									usersLiked: sauceUsersLiked
								}
							)
								.then(() => {
									res.status(200).json({ "message": "Like retiré !" })
								})
								.catch(error => res.status(404).json({ error }));
							break;

						} else if (sauce.usersDisliked.includes(userId)) {
							let sauceDislikes = sauce.dislikes;
							sauceDislikes += - 1;                   // On retire le like
							let sauceUsersDisliked = sauce.usersDisliked;



							for (let i = 0; i < sauceUsersDisliked.length; i++) {      //methode indexOf ne marche pas
								if (sauceUsersDisliked[i] == userId) {
									var index = i
								}
							}

							sauceUsersDisliked.splice(index, 1);

							Sauce.updateOne({ _id: sauceId },
								{
									likes: sauceDislikes,
									usersLiked: sauceUsersDisliked
								}
							)
								.then(() => {
									res.status(200).json({ "message": "Dislike retiré !" });
								})
								.catch(error => res.status(404).json({ error }));

							break;
						} else {
							res.status(400).json({ "error": "User cannot unlike/undislike without having like/dislike first !" });
						}
						break;

					default:
						res.status(400).json({ error: "like must be : -1, 0 or 1 !" });
						break;
				}
			})
			.catch(error => res.status(404).json({ error }));
	} else {
		res.status(400).json({ error: messageError });
	}
}