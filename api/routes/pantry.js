const express = require('express');
const router = express.Router();
const { getIngredientsById, convertAmounts } = require('./spoonacular');
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
                newPantry.ingredients.push({
                    name: ingredient.name,
                    quantity: {
                        amount: ingredient.quantity.amount,
                        unit: ingredient.quantity.unit
                    }
                });
            });
            await newPantry.save();
            res.json(newPantry);
            return;
        }

        for (const ingredient of ingredients) {
            const existingIngredient = pantry.ingredients.find(i => i.name === ingredient.name);
            if (existingIngredient && existingIngredient.quantity.unit !== ingredient.quantity.unit) {
                const convertedAmount = await convertAmounts({
                    ingredientName: ingredient.name,
                    sourceAmount: ingredient.quantity.amount,
                    sourceUnit: ingredient.quantity.unit,
                    targetUnit: existingIngredient.quantity.unit
                });
                ingredient.quantity.amount = convertedAmount.targetAmount;
                ingredient.quantity.unit = existingIngredient.quantity.unit;
            }
        }

        ingredients.forEach(ingredient => {
            const existingIngredient = pantry.ingredients.find(i => i.name === ingredient.name);
            if (existingIngredient) {
                existingIngredient.quantity.amount += ingredient.quantity.amount;
            } else {
                pantry.ingredients.push({
                    name: ingredient.name,
                    quantity: {
                        amount: ingredient.quantity.amount,
                        unit: ingredient.quantity.unit
                    }
                });
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
        if (req.body.recipeId) {
            const recipeIngredients = await getIngredientsById(req.body.recipeId);
            ingredients = recipeIngredients.ingredients.map(ingredient => ({
                name: ingredient.name,
                quantity: {
                    amount: ingredient.amount.metric.value,
                    unit: ingredient.amount.metric.unit
                }
            }));
        }
        const pantry = await Pantry.findOne({ user: req.user._id });

        if (!pantry) {
            res.status(404).json({ error: 'Pantry not found' });
            return;
        }

        for (const ingredient of ingredients) {
            const existingIngredient = pantry.ingredients.find(i => i.name === ingredient.name);
            if (existingIngredient && existingIngredient.quantity.unit !== ingredient.quantity.unit) {
                const convertedAmount = await convertAmounts({
                    ingredientName: ingredient.name,
                    sourceAmount: ingredient.quantity.amount,
                    sourceUnit: ingredient.quantity.unit,
                    targetUnit: existingIngredient.quantity.unit
                });
                ingredient.quantity.amount = convertedAmount.targetAmount;
                ingredient.quantity.unit = existingIngredient.quantity.unit;
            }
        }

        ingredients.forEach(ingredient => {
            const existingIngredient = pantry.ingredients.find(i => i.name === ingredient.name);
            if (existingIngredient) {
                existingIngredient.quantity.amount -= ingredient.quantity.amount;
            }
        });

        pantry.ingredients = pantry.ingredients.filter(i => i.quantity.amount > 0);
        await pantry.save();
        res.json(pantry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;