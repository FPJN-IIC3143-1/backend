const express = require('express');
const router = express.Router()
const { getRecipes, getRecipeInformation } = require('./spoonacular');
const Preferences = require('./models/preferences');


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


router.get('/:id/info', async (req, res) => {
    const data = await getRecipeInformation(req.params.id);
    res.json(data);
    }
);



module.exports = router;