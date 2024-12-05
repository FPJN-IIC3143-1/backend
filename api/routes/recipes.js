const express = require('express');
const router = express.Router()
const { getRecipes, getRecipeInformation, getNutritionById, getRecipeByNutrients } = require('../clients/spoonacular');
const Preferences = require('../models/preferences');
const History = require('../models/history');
const DailyGoal = require('../models/dailyGoal');
const FavoriteRecipes = require('../models/favoriteRecipes');
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

    const HIGH_COVERAGE = 1;
    const MEDIUM_COVERAGE = 0.5;
    const LOW_COVERAGE = 0.25;
    const VERY_LOW_COVERAGE = 0.15;

    let differencePonderator;
    switch (req.query.coverage) {
        case 'high':
            differencePonderator = HIGH_COVERAGE;
            break;
        case 'medium':
            differencePonderator = MEDIUM_COVERAGE;
            break;
        case 'low':
            differencePonderator = LOW_COVERAGE;
            break;
        case 'very-low':
            differencePonderator = VERY_LOW_COVERAGE;
            break;
        default:
            differencePonderator = MEDIUM_COVERAGE;
    }

    const remainingMacros = {
        minCalories: (dailyGoal.calories - consumedMacros.consumed.calories) * differencePonderator,
        minProtein: (dailyGoal.protein - consumedMacros.consumed.protein) * differencePonderator,
        minCarbs: (dailyGoal.carbs - consumedMacros.consumed.carbs) * differencePonderator,
        minFat: (dailyGoal.fats - consumedMacros.consumed.fats) * differencePonderator,
    };
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
    try {
        const nutritionalValues = await getNutritionById(req.params.id);
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

// DE AQI PARA BAIXO É NOVO, FALTA DOCUMENTAR NO README!!!!!!!!!

router.post('/:id/favorite', async (req, res) => {
    try {
        const nutritionalValues = await getNutritionById(req.params.id);
        const calories = parseInt(nutritionalValues.calories);
        const protein = parseInt(nutritionalValues.protein.slice(0, -1));
        const carbs = parseInt(nutritionalValues.carbs.slice(0, -1));
        const fats = parseInt(nutritionalValues.fat.slice(0, -1));

        const favorite = {
            user: req.user._id,
            recipe_id: req.params.id,
            protein,
            carbs,
            fats,
            calories
        };

        await FavoriteRecipes.findOneAndUpdate(
            { user: req.user._id, recipe_id: req.params.id },
            favorite,
            { upsert: true }
        );
        res.status(201).json({ message: 'Recipe added to favorites' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add recipe to favorites' });
    }
});

router.delete('/:id/favorite', async (req, res) => {
    try {
        await FavoriteRecipes.deleteOne({ user: req.user._id, recipe_id: req.params.id });
        res.status(200).json({ message: 'Recipe removed from favorites' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove recipe from favorites' });
    }
});

router.get('/favorites', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Default to last 10 favorites if limit is not specified
    const favorites = await FavoriteRecipes.find({ user: req.user._id })
        .sort({ _id: -1 }) // Sort by descending order of _id to get the most recent entries
        .limit(limit);
    res.json(favorites);
});

router.get('/lastConsumed', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Default to last 10 consumed recipes if limit is not specified
    const history = await History.find({ user: req.user._id })
        .sort({ _id: -1 }) // Sort by descending order of _id to get the most recent entries
        .limit(limit);
    res.json(history);
});


module.exports = router;
