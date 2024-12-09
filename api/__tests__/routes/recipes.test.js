const request = require('supertest');
const express = require('express');
const router = require('../../routes/recipes');
const { getRecipes, getRecipeInformation, getNutritionById } = require('../../clients/spoonacular');
const Preferences = require('../../models/preferences');
const History = require('../../models/history');
const DailyGoal = require('../../models/dailyGoal');
const FavoriteRecipes = require('../../models/favoriteRecipes');
const { getDailyMacros } = require('../../routes/nutrition');

jest.mock('../../clients/spoonacular');
jest.mock('../../models/preferences');
jest.mock('../../models/history');
jest.mock('../../models/dailyGoal');
jest.mock('../../models/favoriteRecipes');
jest.mock('../../routes/nutrition');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.user = { _id: 'testUserId' };
    next();
});
app.use('/recipes', router);

describe('Recipe Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /recipes', () => {
        it('should return recipes with user preferences', async () => {
            const mockPreferences = { diet: 'vegetarian', intolerances: 'dairy' };
            const mockRecipes = { results: [{ id: 1, title: 'Test Recipe' }] };

            Preferences.findOne.mockResolvedValue(mockPreferences);
            getRecipes.mockResolvedValue(mockRecipes);

            const response = await request(app).get('/recipes');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRecipes);
            expect(getRecipes).toHaveBeenCalledWith(expect.objectContaining(mockPreferences));
        });

        it('should handle case with no preferences', async () => {
            Preferences.findOne.mockResolvedValue(null);
            const mockRecipes = { results: [{ id: 1, title: 'Test Recipe' }] };
            getRecipes.mockResolvedValue(mockRecipes);

            const response = await request(app).get('/recipes');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRecipes);
            expect(getRecipes).toHaveBeenCalledWith(expect.objectContaining({
                diet: null,
                intolerances: null
            }));
        });
    });

    describe('GET /recipes/generateByNutritionalGoals', () => {
        it('should generate recipes based on remaining daily goals', async () => {
            const mockPreferences = { diet: 'vegetarian' };
            const mockDailyGoal = { calories: 2000, protein: 150, carbs: 200, fats: 70 };
            const mockConsumed = {
                consumed: { calories: 1000, protein: 75, carbs: 100, fats: 35 },
                goal: mockDailyGoal
            };
            const mockRecipes = { results: [{ id: 1, title: 'Test Recipe' }] };

            Preferences.findOne.mockResolvedValue(mockPreferences);
            DailyGoal.findOne.mockResolvedValue(mockDailyGoal);
            getDailyMacros.mockResolvedValue(mockConsumed);
            getRecipes.mockResolvedValue(mockRecipes);

            const response = await request(app)
                .get('/recipes/generateByNutritionalGoals')
                .query({ coverage: 'medium' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRecipes);
        });

        it('should handle different coverage levels', async () => {
            const mockPreferences = { diet: 'vegetarian' };
            const mockDailyGoal = { calories: 2000, protein: 150, carbs: 200, fats: 70 };
            const mockConsumed = {
                consumed: { calories: 1000, protein: 75, carbs: 100, fats: 35 },
                goal: mockDailyGoal
            };
            const mockRecipes = { results: [{ id: 1, title: 'Test Recipe' }] };

            Preferences.findOne.mockResolvedValue(mockPreferences);
            DailyGoal.findOne.mockResolvedValue(mockDailyGoal);
            getDailyMacros.mockResolvedValue(mockConsumed);
            getRecipes.mockResolvedValue(mockRecipes);

            const coverageLevels = ['high', 'medium', 'low', 'very-low', 'invalid'];

            for (const coverage of coverageLevels) {
                const response = await request(app)
                    .get('/recipes/generateByNutritionalGoals')
                    .query({ coverage });

                expect(response.status).toBe(200);
                expect(response.body).toEqual(mockRecipes);
            }
        });

        it('should handle missing daily goal', async () => {
            DailyGoal.findOne.mockResolvedValue(null);

            const response = await request(app).get('/recipes/generateByNutritionalGoals');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Daily goal not found' });
        });
    });

    describe('GET /recipes/:id/nutrition', () => {
        it('should return recipe nutrition information', async () => {
            const mockNutrition = { calories: '500 kcal', protein: '20g' };
            getNutritionById.mockResolvedValue(mockNutrition);

            const response = await request(app).get('/recipes/123/nutrition');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockNutrition);
        });
    });

    describe('GET /recipes/:id/info', () => {
        it('should return recipe information', async () => {
            const mockInfo = { id: 123, title: 'Test Recipe', instructions: 'Test instructions' };
            getRecipeInformation.mockResolvedValue(mockInfo);

            const response = await request(app).get('/recipes/123/info');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockInfo);
        });
    });

    describe('POST /recipes/:id/register', () => {
        it('should register recipe consumption', async () => {
            const mockNutrition = {
                calories: '500',
                protein: '20g',
                carbs: '30g',
                fat: '15g'
            };
            getNutritionById.mockResolvedValue(mockNutrition);
            History.prototype.save = jest.fn().mockResolvedValue(undefined);

            const response = await request(app).post('/recipes/123/register');

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Recipe consumption registered successfully' });
        });

        it('should handle registration errors', async () => {
            getNutritionById.mockRejectedValue(new Error('API Error'));

            const response = await request(app).post('/recipes/123/register');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to register recipe consumption' });
        });
    });

    describe('POST /recipes/:id/favorite', () => {
        it('should add recipe to favorites', async () => {
            const mockNutrition = {
                calories: '500',
                protein: '20g',
                carbs: '30g',
                fat: '15g'
            };
            getNutritionById.mockResolvedValue(mockNutrition);
            FavoriteRecipes.findOneAndUpdate.mockResolvedValue(undefined);

            const response = await request(app).post('/recipes/123/favorite');

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Recipe added to favorites' });
        });

        it('should handle favorite addition errors', async () => {
            getNutritionById.mockRejectedValue(new Error('API Error'));

            const response = await request(app).post('/recipes/123/favorite');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to add recipe to favorites' });
        });
    });

    describe('DELETE /recipes/:id/favorite', () => {
        it('should remove recipe from favorites', async () => {
            FavoriteRecipes.deleteOne.mockResolvedValue({ deletedCount: 1 });

            const response = await request(app).delete('/recipes/123/favorite');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Recipe removed from favorites' });
        });

        it('should handle favorite removal errors', async () => {
            FavoriteRecipes.deleteOne.mockRejectedValue(new Error('Database Error'));

            const response = await request(app).delete('/recipes/123/favorite');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to remove recipe from favorites' });
        });
    });

    describe('GET /recipes/favorites', () => {
        it('should return favorite recipes with default limit', async () => {
            const mockFavorites = [
                { recipe_id: 1, title: 'Recipe 1' },
                { recipe_id: 2, title: 'Recipe 2' }
            ];
            FavoriteRecipes.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    limit: jest.fn().mockResolvedValue(mockFavorites)
                })
            });

            const response = await request(app).get('/recipes/favorites');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockFavorites);
        });

        it('should respect custom limit parameter', async () => {
            const mockFavorites = [{ recipe_id: 1, title: 'Recipe 1' }];
            FavoriteRecipes.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    limit: jest.fn().mockResolvedValue(mockFavorites)
                })
            });

            const response = await request(app).get('/recipes/favorites?limit=1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockFavorites);
        });
    });

    describe('GET /recipes/lastConsumed', () => {
        it('should return last consumed recipes with default limit', async () => {
            const mockDate = new Date('2024-01-01T12:00:00Z');
            const mockHistory = [
                { recipe_id: 1, consumedAt: mockDate },
                { recipe_id: 2, consumedAt: mockDate }
            ];
            History.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    limit: jest.fn().mockResolvedValue(mockHistory)
                })
            });

            const response = await request(app).get('/recipes/lastConsumed');

            expect(response.status).toBe(200);
            const expectedResponse = mockHistory.map(item => ({
                ...item,
                consumedAt: item.consumedAt.toISOString()
            }));
            expect(response.body).toEqual(expectedResponse);
        });

        it('should respect custom limit parameter', async () => {
            const mockDate = new Date('2024-01-01T12:00:00Z');
            const mockHistory = [{ recipe_id: 1, consumedAt: mockDate }];
            History.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    limit: jest.fn().mockResolvedValue(mockHistory)
                })
            });

            const response = await request(app).get('/recipes/lastConsumed?limit=1');

            expect(response.status).toBe(200);
            const expectedResponse = mockHistory.map(item => ({
                ...item,
                consumedAt: item.consumedAt.toISOString()
            }));
            expect(response.body).toEqual(expectedResponse);
        });
    });
});
