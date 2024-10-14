const express = require('express');
const router = express.Router();
const History = require('../models/history');
const DailyGoal = require('../models/dailyGoal');


router.get('/dailyGoal', async (req, res) => {
    try {
        const dailyMacros = await getDailyMacros(req.user._id);
        res.json(dailyMacros);
    } catch (error) {
        res.status(500).json({ error: error.message }); // Ensure error is caught and response is sent
    }
});

async function getDailyMacros(userId) {
    const dailyGoal = await DailyGoal.findOne({
        user: userId,
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const consumedToday = await History.aggregate([
        {
            $match: {
                user: userId,
                consumedAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            }
        },
        {
            $group: {
                _id: null,
                protein: { $sum: "$protein" },
                carbs: { $sum: "$carbs" },
                fats: { $sum: "$fats" },
                calories: { $sum: "$calories" }
            }
        }
    ]);

    return {
        consumed: {
            protein: consumedToday[0]?.protein || 0,
            carbs: consumedToday[0]?.carbs || 0,
            fats: consumedToday[0]?.fats || 0,
            calories: consumedToday[0]?.calories || 0
        },
        goal: {
            protein: dailyGoal.protein,
            carbs: dailyGoal.carbs,
            fats: dailyGoal.fats,
            calories: dailyGoal.calories
        }
    };
}

router.post('/dailyGoal', async (req, res) => {
    try {
        const { protein, carbs, fats, calories } = req.body;
        const userId = req.user._id;

        let dailyGoal = await DailyGoal.findOne({ user: userId });

        if (dailyGoal) {
            dailyGoal.protein = protein;
            dailyGoal.carbs = carbs;
            dailyGoal.fats = fats;
            dailyGoal.calories = calories;
            await dailyGoal.save();
            res.status(200).json({ message: 'Daily goal updated successfully' });
        } else {
            dailyGoal = new DailyGoal({
                user: userId,
                protein,
                carbs,
                fats,
                calories
            });
            await dailyGoal.save();
            res.status(201).json({ message: 'Daily goal set successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // Ensure error is caught and response is sent
    }
});


module.exports = router;
