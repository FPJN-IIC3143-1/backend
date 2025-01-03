const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    consumedAt: {
        type: Date,
    },
    recipe_id: {
        type: String,
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
    ingredients: {
        type: [String],
    },
}, {
    timestamps: true,
})

const History = mongoose.model('History', historySchema);

module.exports = History;