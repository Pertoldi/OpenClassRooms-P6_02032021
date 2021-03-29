const multer = require('multer');       //multer permet de gérer les fichiers entrants // multer ajoute une propriété req.file

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); 
        const extention = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extention);     //le nouveau filename avec le nom sans espace + un timestamp(pour sassurer que le nom est unique à la miliseconde près) + . et l'extention
    }
});

module.exports = multer({ storage }).single('image');