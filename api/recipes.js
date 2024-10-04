const express = require('express');
const router = express.Router()


app.get('/recipes', async (req, res) => {
    const data = await getRecipes(req.query);
    res.json(data);
    }
);

app.get('/recipes/:id/info', async (req, res) => {
    const data = await getRecipeInformation(req.params.id);
    res.json(data);
    }
);