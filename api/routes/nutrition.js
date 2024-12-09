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
            protein: dailyGoal?.protein || 0,
            carbs: dailyGoal?.carbs || 0,
            fats: dailyGoal?.fats || 0,
            calories: dailyGoal?.calories || 0
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

router.get('/consumedOverPeriod', async (req, res) => {
    try {
        const period = req.query.period;
        const userId = req.user._id;

        let startDate, endDate;
        const now = new Date();

        if (period === 'this week') {
            startDate = new Date(now.setDate(now.getDate() - now.getDay()));
            endDate = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        } else if (period === 'last week') {
            startDate = new Date(now.setDate(now.getDate() - now.getDay() - 7));
            endDate = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        } else if (period === 'this month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else {
            return res.status(400).json({ error: 'Invalid period parameter' });
        }

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const consumedData = await History.aggregate([
            {
                $match: {
                    user: userId,
                    consumedAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    protein: { $sum: "$protein" },
                    carbs: { $sum: "$carbs" },
                    fats: { $sum: "$fats" },
                    calories: { $sum: "$calories" },
                    ingredients: { $addToSet: "$ingredients" }
                }
            }
        ]);

        const consumed = consumedData[0] || {
            protein: 0,
            carbs: 0,
            fats: 0,
            calories: 0,
            ingredients: []
        };

        res.json({
            macronutrients: {
                protein: consumed.protein,
                carbs: consumed.carbs,
                fats: consumed.fats,
                calories: consumed.calories
            },
            ingredients: consumed.ingredients.flat()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = {
    nutritionRoutes: router,
    getDailyMacros,
}
