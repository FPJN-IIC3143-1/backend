const mongoose = require('mongoose');

const dailyGoalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

const DailyGoal = mongoose.model('DailyGoal', dailyGoalSchema);

module.exports = DailyGoal;