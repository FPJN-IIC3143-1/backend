const request = require('supertest');
const express = require('express');
const router = require('../../routes/recipes');

const Preferences = require('../../models/preferences');
const History = require('../../models/history');
const DailyGoal = require('../../models/dailyGoal');

const { getRecipes, getRecipeInformation, getNutritionById } = require('../../clients/spoonacular');
const { getDailyMacros } = require('../../routes/nutrition');

jest.mock('../../models/preferences');
jest.mock('../../models/history');
jest.mock('../../models/dailyGoal');
jest.mock('../../clients/spoonacular');
jest.mock('../../routes/nutrition');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.user = { _id: 'user123' };
    next();
});
app.use('/recipes', router);

describe('Recipes API', () => {
    describe('GET /recipes', () => {
        it('should return recipes based on user preferences and query parameters', async () => {
            getRecipes.mockResolvedValue([
                { id: 1, title: 'Vegetarian Pizza' },
                { id: 2, title: 'Gluten-Free Pasta' }
            ]);

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

        it('should return recipes with null preferences if none are found', async () => {
            getRecipes.mockResolvedValue([
                { id: 7, title: 'Default Preference Meal' }
            ]);

            Preferences.findOne.mockResolvedValue(null);

            const response = await request(app)
                .get('/recipes')
                .query({ cuisine: 'Mexican' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { id: 7, title: 'Default Preference Meal' }
            ]);
        });
    });

    describe('GET /recipes/generateByNutritionalGoals', () => {
        const dailyGoalMock = {
            calories: 2500,
            protein: 150,
            carbs: 200,
            fats: 70
        };

        const consumedMacrosMock = {
            consumed: {
                calories: 1200,
                protein: 50,
                carbs: 100,
                fats: 30
            }
        };

        it('should return recipes based on nutritional goals and preferences with medium coverage', async () => {
            getRecipes.mockResolvedValue([
                { id: 3, title: 'High Protein Salad' }
            ]);

            Preferences.findOne.mockResolvedValue({
                diet: 'high-protein',
                intolerances: 'none'
            });

            DailyGoal.findOne.mockResolvedValue(dailyGoalMock);

            getDailyMacros.mockResolvedValue(consumedMacrosMock);

            const response = await request(app)
                .get('/recipes/generateByNutritionalGoals')
                .query({ coverage: 'medium' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { id: 3, title: 'High Protein Salad' }
            ]);
        });

        it('should return 404 if daily goal is not found', async () => {
            DailyGoal.findOne.mockResolvedValue(null);

            const response = await request(app)
                .get('/recipes/generateByNutritionalGoals');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Daily goal not found' });
        });

        it('should return recipes with high coverage', async () => {
            getRecipes.mockResolvedValue([
                { id: 4, title: 'High Coverage Meal' }
            ]);

            Preferences.findOne.mockResolvedValue({
                diet: 'balanced',
                intolerances: 'none'
            });

            DailyGoal.findOne.mockResolvedValue(dailyGoalMock);

            getDailyMacros.mockResolvedValue(consumedMacrosMock);

            const response = await request(app)
                .get('/recipes/generateByNutritionalGoals')
                .query({ coverage: 'high' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { id: 4, title: 'High Coverage Meal' }
            ]);
        });

        it('should return recipes with medium coverage', async () => {
            getRecipes.mockResolvedValue([
                { id: 8, title: 'Medium Coverage Meal' }
            ]);

            Preferences.findOne.mockResolvedValue({
                diet: 'balanced',
                intolerances: 'none'
            });

            DailyGoal.findOne.mockResolvedValue(dailyGoalMock);

            getDailyMacros.mockResolvedValue(consumedMacrosMock);

            const response = await request(app)
                .get('/recipes/generateByNutritionalGoals')
                .query({ coverage: 'medium' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { id: 8, title: 'Medium Coverage Meal' }
            ]);
        });

        it('should return recipes with low coverage', async () => {
            getRecipes.mockResolvedValue([
                { id: 5, title: 'Low Coverage Meal' }
            ]);

            Preferences.findOne.mockResolvedValue({
                diet: 'low-carb',
                intolerances: 'none'
            });

            DailyGoal.findOne.mockResolvedValue(dailyGoalMock);

            getDailyMacros.mockResolvedValue(consumedMacrosMock);

            const response = await request(app)
                .get('/recipes/generateByNutritionalGoals')
                .query({ coverage: 'low' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { id: 5, title: 'Low Coverage Meal' }
            ]);
        });

        it('should return recipes with very-low coverage', async () => {
            getRecipes.mockResolvedValue([
                { id: 6, title: 'Very Low Coverage Meal' }
            ]);

            Preferences.findOne.mockResolvedValue({
                diet: 'keto',
                intolerances: 'none'
            });

            DailyGoal.findOne.mockResolvedValue(dailyGoalMock);

            getDailyMacros.mockResolvedValue(consumedMacrosMock);

            const response = await request(app)
                .get('/recipes/generateByNutritionalGoals')
                .query({ coverage: 'very-low' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { id: 6, title: 'Very Low Coverage Meal' }
            ]);
        });

        it('should return recipes with no coverage specified', async () => {
            getRecipes.mockResolvedValue([
                { id: 8, title: 'No Coverage Meal' }
            ]);

            Preferences.findOne.mockResolvedValue({
                diet: 'vegan',
                intolerances: 'none'
            });

            DailyGoal.findOne.mockResolvedValue(dailyGoalMock);

            getDailyMacros.mockResolvedValue(consumedMacrosMock);

            const response = await request(app)
                .get('/recipes/generateByNutritionalGoals');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { id: 8, title: 'No Coverage Meal' }
            ]);
        });
    });

    describe('GET /recipes/:id/nutrition', () => {
        it('should return nutrition information for a specific recipe', async () => {
            getNutritionById.mockResolvedValue({
                calories: '500 kcal',
                protein: '20g',
                carbs: '60g',
                fat: '15g'
            });

            const response = await request(app)
                .get('/recipes/1/nutrition');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                calories: '500 kcal',
                protein: '20g',
                carbs: '60g',
                fat: '15g'
            });
        });
    });

    describe('GET /recipes/:id/info', () => {
        it('should return recipe information for a specific recipe', async () => {
            getRecipeInformation.mockResolvedValue({
                id: 1,
                title: 'Vegetarian Pizza',
                ingredients: ['dough', 'tomato sauce', 'cheese', 'bell peppers'],
                instructions: 'Bake at 400 degrees for 20 minutes.'
            });

            const response = await request(app)
                .get('/recipes/1/info');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 1,
                title: 'Vegetarian Pizza',
                ingredients: ['dough', 'tomato sauce', 'cheese', 'bell peppers'],
                instructions: 'Bake at 400 degrees for 20 minutes.'
            });
        });
    });

    describe('POST /recipes/:id/register', () => {
        it('should register recipe consumption and return success message', async () => {
            getNutritionById.mockResolvedValue({
                calories: '500 kcal',
                protein: '20g',
                carbs: '60g',
                fat: '15g'
            });

            const saveMock = jest.fn().mockResolvedValue();
            History.mockImplementation(() => ({ save: saveMock }));

            const response = await request(app)
                .post('/recipes/1/register');

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Recipe consumption registered successfully' });
            expect(saveMock).toHaveBeenCalled();
        });

        it('should handle errors during recipe consumption registration', async () => {
            History.mockImplementation(() => ({ save: jest.fn().mockRejectedValue(new Error('Failed to register recipe consumption')) }));

            const response = await request(app)
                .post('/recipes/1/register');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to register recipe consumption' });
        });
    });
});
