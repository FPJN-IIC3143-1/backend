const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
    diet: {
        type: String,
    },
    intolerances: {
        type: [String],
    },
}, {
    timestamps: true,
})

const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;