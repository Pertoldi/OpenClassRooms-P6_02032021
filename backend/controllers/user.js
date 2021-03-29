const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, next) => {
	//CONTROL FORM
	let messageError = "";
	let isOk = true;
	let watchSizePwd = req.body.password.split("");
	let checkSpecialCaractere = /^[^@&"'`~^#{}<>_=\[\]()!:;,?./§$£€*\+]+$/;
	let checkSpecialCaractereForEmail = /^[^&"'`~^#{}<>_=\[\]()!:;,?/§$£€*\+]+$/;

	if (watchSizePwd.length < 8) {							//On veut une taille minimum de 8 char pour le password
		isOk = false;
		messageError = "Mot de passe trop court !";
	} else if (!checkSpecialCaractere.test(req.body.password)) {
		isOk = false;
		messageError = "Il ne faut pas de caractère spécial pour le mot de passe !";
	} else if (!checkSpecialCaractereForEmail.test(req.body.email)) {
		isOk = false;
		messageError = "Nom d'utilisateur invalide !";
	}

	if (isOk) {
		//LOGIQUE METIER
		bcrypt.hash(req.body.password, 10)
			.then(hash => {
				const user = new User({
					email: req.body.email,
					password: hash
				});
				user.save()
					.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
					.catch(error => res.status(400).json({ error }));
			})
			.catch(error => res.status(500).json({ error }));
	} else {
		res.status(400).json({ error: messageError });
	}
};

exports.login = (req, res, next) => {
	//CONTROL FORM
	let isOk = true;
	let checkSpecialCaractere = /^[^@&"'`~^#{}<>=\[\]()!:;,?./§$£€*\+]+$/;
	let checkSpecialCaractereForEmail = /^[^&"'`~^#{}<>=\[\]()!:;,?/§$£€*\+]+$/;

	if (!checkSpecialCaractere.test(req.body.password)) isOk = false;
	else if (!checkSpecialCaractereForEmail.test(req.body.email)) isOk = false;

	//LOGIQUE METIER
	if (isOk) {
		User.findOne({ email: req.body.email })
			.then(user => {
				if (!user) {
					return res.status(401).json({ error: 'Utilisateur non trouvé !' });
				}
				bcrypt.compare(req.body.password, user.password)
					.then(valid => {
						if (!valid) {
							return res.status(401).json({ error: 'Mot de passe incorrect !' });
						}
						res.status(200).json({
							userId: user._id,
							token: jwt.sign(
								{ userId: user._id },
								`${process.env.TOKEN_SECRET}`,
								{ expiresIn: '6h' }
							)
						});
					})
					.catch(error => res.status(500).json({ error }));
			})
			.catch(error => res.status(500).json({ error }));
	} else {
		res.status(400).json({ error: "Données nom Conforme !" })
	}
};
