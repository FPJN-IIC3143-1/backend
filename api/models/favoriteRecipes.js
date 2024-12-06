const mongoose = require('mongoose');

const favoriteRecipesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipe_id: {
        type: String,
        required: true,
    },
    protein: {
        type: Number,
    },
    carbs: {
        type: Number,
    },
    fats: {
        type: Number,
    },
    calories: {
        type: Number,
    },
}, {
    timestamps: true,
})

const FavoriteRecipes = mongoose.model('FavoriteRecipes', favoriteRecipesSchema);

module.exports = FavoriteRecipes;