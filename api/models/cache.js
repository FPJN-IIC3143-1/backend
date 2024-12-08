const mongoose = require('mongoose');

const cacheSchema = new mongoose.Schema({
    url:{
        type: String,
        required: true,
    },
    response: {
        type: Object,
        required: true,
    },
}, {
    timestamps: true,
})

const Cache = mongoose.model('Cache', cacheSchema);

module.exports = Cache;