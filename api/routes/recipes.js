const express = require('express');
const router = express.Router()
const { getRecipes, getRecipeInformation, getNutritionById, getRecipeByNutrients } = require('./spoonacular');
const Preferences = require('../models/preferences');
const History = require('../models/history');
const DailyGoal = require('../models/dailyGoal');
const { getDailyMacros } = require('./nutrition');


router.get('/', async (req, res) => {
    const preferences = await getPreferences(req.user._id);
    const data = await getRecipes({...preferences, ...req.query});
    res.json(data);
    }
);

async function getPreferences(userId) {
    const preferences = await Preferences.findOne({
        user: userId,
    });

    if (!preferences) {
        // Handle the case where no preferences are found
        return {
            diet: null,
            intolerances: null
        };
    }

    return {
        diet: preferences.diet,
        intolerances: preferences.intolerances
    };
}

router.get('/generateByNutritionalGoals', async (req, res) => {
    const preferences = await getPreferences(req.user._id);
    const dailyGoal = await DailyGoal.findOne({ user: req.user._id });

    if (!dailyGoal) {
        return res.status(404).json({ error: 'Daily goal not found' });
    }

    const consumedMacros = await getDailyMacros(req.user._id);

    let differencePonderator;
    if (req.query.coverage === 'high') {
        differencePonderator = 1;
    } else if (req.query.coverage === 'medium' || !req.query.coverage) {
        differencePonderator = 0.5;
    } else if (req.query.coverage === 'low') {
        differencePonderator = 0.25;
    } else if (req.query.coverage === 'very-low') {
        differencePonderator = 0.15;
    }

    const remainingMacros = {
        minCalories: (dailyGoal.calories - consumedMacros.consumed.calories) * differencePonderator,
        minProtein: (dailyGoal.protein - consumedMacros.consumed.protein) * differencePonderator,
        minCarbs: (dailyGoal.carbs - consumedMacros.consumed.carbs) * differencePonderator,
        minFat: (dailyGoal.fats - consumedMacros.consumed.fats) * differencePonderator,
    };
    console.log({ ...preferences, ...remainingMacros, ...req.query });
    const data = await getRecipes({ ...preferences, ...remainingMacros, ...req.query });
    res.json(data);
});

router.get('/:id/nutrition', async (req, res) => {
    const data = await getNutritionById(req.params.id);
    res.json(data);
    }
);

router.get('/:id/info', async (req, res) => {
    const data = await getRecipeInformation(req.params.id);
    res.json(data);
    }
);

router.post('/:id/register', async (req, res) => {
    const nutritionalValues = await getNutritionById(req.params.id);
    try {
        const calories = parseInt(nutritionalValues.calories);
        const protein = parseInt(nutritionalValues.protein.slice(0, -1));
        const carbs = parseInt(nutritionalValues.carbs.slice(0, -1));
        const fat = parseInt(nutritionalValues.fat.slice(0, -1));
        const historyEntry = new History({
            user: req.user._id,
            consumedAt: new Date(),
            recipe_id: req.params.id,
            protein,
            carbs,
            fat,
            calories
        });
        await historyEntry.save();
        res.status(201).json({ message: 'Recipe consumption registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register recipe consumption' });
    }
});


module.exports = router;