const express = require('express');
const router = express.Router();
const { convertAmounts } = require('../clients/spoonacular');
const Pantry = require('../models/pantry');


router.get('/', async (req, res) => {
    try {
        const pantry = await Pantry.find({ user: req.user._id });
        res.json(pantry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/modifyIngredients', async (req, res) => {
    try {
        const ingredients = req.body.ingredients;
        const receivedSign = req.body.sign;

        let pantry = await Pantry.findOne({ user: req.user._id });

        if (!pantry) {
            pantry = new Pantry({ user: req.user._id, ingredients: [] });
        }

        for (let ingredient of ingredients) {
            let existingIngredient = pantry.ingredients.find(i => i.name === ingredient.name);
            if (existingIngredient) {
                if (existingIngredient.quantity.unit !== ingredient.quantity.unit) {

                    const sign = Math.sign(receivedSign) || 1;

                    ingredient = await convertIngredientUnit(ingredient, existingIngredient.quantity.unit);

                    ingredient.quantity.amount = sign * ingredient.quantity.amount;
                }
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
        }

        pantry.ingredients = pantry.ingredients.filter(i => i.quantity.amount > 0);
        await pantry.save();
        res.json(pantry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function convertIngredientUnit(ingredient, storedUnit) {
    let convertedAmount;
    if (storedUnit === "") {
        convertedAmount = await convertAmounts({
            ingredientName: ingredient.name,
            sourceAmount: 1,
            sourceUnit: storedUnit,
            targetUnit: ingredient.quantity.unit
        });

        const convertRate = convertedAmount.targetAmount;

        ingredient.quantity.amount /= convertRate;
        ingredient.quantity.unit = storedUnit;
    } else {
        convertedAmount = await convertAmounts({
            ingredientName: ingredient.name,
            sourceAmount: ingredient.quantity.amount,
            sourceUnit: ingredient.quantity.unit,
            targetUnit: storedUnit
        });
    
        ingredient.quantity.amount = convertedAmount.targetAmount;
        ingredient.quantity.unit = storedUnit;
    }

    return ingredient;
}

router.post('/updatePantry', async (req, res) => {
    try {
        const pantry = await Pantry.findOne({ user: req.user._id });
        if (!pantry) {
            res.status(404).json({ error: 'Pantry not found' });
            return;
        }
        pantry.ingredients = req.body.ingredients;
        pantry.ingredients = pantry.ingredients.filter(i => i.quantity.amount > 0);
        await pantry.save();
        res.json(pantry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
