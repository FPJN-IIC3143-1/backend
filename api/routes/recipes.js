const express = require('express');
const router = express.Router()
const { getRecipes, getRecipeInformation, getNutritionById } = require('./spoonacular');
const Preferences = require('../models/preferences');
const History = require('../models/history');


router.get('/', async (req, res) => {
    const preferences = await getPreferences(req.user._id);
    console.log({...preferences, ...req.query})
    const data = await getRecipes({...preferences, ...req.query});
    res.json(data);
    }
);

async function getPreferences(userId) {
    const preferences = await Preferences.findOne({
        user: userId,
    });
    return {
        diet: preferences.diet,
        intolerances: preferences.intolerances
    };
}

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