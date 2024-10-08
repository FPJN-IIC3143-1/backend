const express = require('express');
const router = express.Router()
const { getRecipes, getRecipeInformation } = require('./spoonacular');
const Preferences = require('./models/preferences');


router.get('/recipes', async (req, res) => {
    const preferences = await getPreferences({ _id: 0});
    
    
    const data = await getRecipes(req.query);
    
    
    if (!data.intolerances)
        
    
    res.json(data);
    }
);

function getPreferences(user_id) {
    return Preferences.findOne({
        user: user_id,
    });
}


router.get('/recipes/:id/info', async (req, res) => {
    const data = await getRecipeInformation(req.params.id);
    res.json(data);
    }
);



module.exports = router;