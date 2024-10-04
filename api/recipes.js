const express = require('express');
const router = express.Router()
const { getRecipes, getRecipeInformation } = require('./spoonacular');


router.get('/recipes', async (req, res) => {
    const data = await getRecipes(req.query);
    res.json(data);
    }
);

router.get('/recipes/:id/info', async (req, res) => {
    const data = await getRecipeInformation(req.params.id);
    res.json(data);
    }
);


module.exports = router;