const request = require('supertest');
const express = require('express');
const router = require('../../routes/recipes');
const Preferences = require('../../models/preferences');
const { getRecipes } = require('../../routes/spoonacular');

// Mock the necessary modules
jest.mock('../../models/preferences');
jest.mock('../../routes/spoonacular');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.user = { _id: 'user123' };
    next();
});
app.use('/recipes', router);

describe('GET /recipes', () => {
    it('should return recipes based on user preferences and query parameters', async () => {
        // Mock getRecipes function
        getRecipes.mockResolvedValue([
            { id: 1, title: 'Vegetarian Pizza' },
            { id: 2, title: 'Gluten-Free Pasta' }
        ]);

        // Mock user preferences
        Preferences.findOne.mockResolvedValue({
            diet: 'vegetarian',
            intolerances: 'gluten'
        });

        const response = await request(app)
            .get('/recipes')
            .query({ cuisine: 'Italian' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { id: 1, title: 'Vegetarian Pizza' },
            { id: 2, title: 'Gluten-Free Pasta' }
        ]);
    });
});
