const mongoose = require('mongoose'); // Base de donnée mongoDB

const sauceSchema = mongoose.Schema({
    userId: { type: String, require: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    userLiked: { type: [String], required: true },
    userDisliked: { type: [String], required: true }
});

module.exports = mongoose.model('Sauce', sauceSchema);