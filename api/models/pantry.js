const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
                default: "",
            }
        }
    }],
}, {
    timestamps: true,
});

const Pantry = mongoose.model('Pantry', pantrySchema);

module.exports = Pantry;