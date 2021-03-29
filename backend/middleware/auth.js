//auth pour authentification
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) { //Si on a un userId dans le corps de la requête et que celui-ci est différent de l'userId du token
      throw 'Invalid user ID';      //erreur personalisée
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !' });  // si il y a une erruer envoie l'erreur, si un pb sans erreur renvoyé -> req non authentifié
  }
};