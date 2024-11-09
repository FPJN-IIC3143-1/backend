const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    ingredients: [{
        name: {
            type: String,
            required: true,
        },
        quantity: {
            amount: {
                type: Number,
                required: true,
            },
            unit: {
                type: String,
                required: true,
            }
        }
    }],
}, {
    timestamps: true,
});

const Pantry = mongoose.model('Pantry', pantrySchema);

module.exports = Pantry;