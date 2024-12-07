const mongoose = require('mongoose');


const getRandom26LetterString = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({ length: 26 }, () => letters[Math.floor(Math.random() * 26)]).join('');
}

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    buyOrder: {
        type: String,
        default: getRandom26LetterString,
        required: true,
    },
    sessionId: {
        type: String,
        required: true,
        unique: true,
        default: getRandom26LetterString,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'INITIALIZED'
    },
}, {
    timestamps: true,
})


const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
