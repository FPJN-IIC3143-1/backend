const express = require('express');
const { getRecipes, getRecipeInformation } = require('./spoonacular');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
mongoose.connect('mongodb://mongo:27017/test')

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello Worlds!');
});


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

app.post('/preferences', (req, res) => {
    const { preferences } = req.body;
    res.json({ preferences });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



