const express = require('express');
const router = express.Router();
const { getIngredientsById } = require('./spoonacular');
const Pantry = require('../models/pantry');


router.get('/', async (req, res) => {
    try {
        const pantry = await Pantry.find({ user: req.user._id });
        res.json(pantry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/addIngredients', async (req, res) => {
    try {
        const ingredients = req.body.ingredients;
        const pantry = await Pantry.findOne({ user: req.user._id });

        if (!pantry) {
            const newPantry = new Pantry({
            user: req.user._id,
            ingredients: []
            });
            ingredients.forEach(ingredient => {
            newPantry.ingredients.push(ingredient);
            });
            await newPantry.save();
            res.json(newPantry);
            return;
        }

        ingredients.forEach(ingredient => {
            const existingIngredient = pantry.ingredients.find(i => i.name === ingredient.name);
            if (existingIngredient) {
            existingIngredient.quantity += ingredient.quantity;
            } else {
            pantry.ingredients.push(ingredient);
            }
        });

        await pantry.save();
        res.json(pantry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/removeIngredients', async (req, res) => {
    try {
        let ingredients = req.body.ingredients;
        if (ingredients.length === 0 && req.body.recipeId) {
            const recipeIngredients = await getIngredientsById(req.body.recipeId);
            ingredients = recipeIngredients.ingredients;
        }
        const pantry = await Pantry.findOne({ user: req.user._id });

        if (!pantry) {
            res.status(404).json({ error: 'Pantry not found' });
            return;
        }

        ingredients.forEach(ingredient => {
            const existingIngredient = pantry.ingredients.find(i => i.name === ingredient.name);
            if (existingIngredient) {
            existingIngredient.quantity -= ingredient.quantity;
            }
        });

        pantry.ingredients = pantry.ingredients.filter(i => i.quantity > 0);
        await pantry.save();
        res.json(pantry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;