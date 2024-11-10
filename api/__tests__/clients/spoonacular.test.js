const { getRecipes, getRecipeInformation, getNutritionById, getIngredientsById, convertAmounts } = require('../../clients/spoonacular');
const axios = require('axios');

jest.mock('axios');

describe('Spoonacular API Client', () => {
    describe('getRecipes', () => {
        it('should fetch recipes based on parameters', async () => {
            const mockResponse = { data: { results: [{ id: 1, title: 'Vegetarian Pizza' }] } };
            axios.get.mockResolvedValue(mockResponse);

            const params = { diet: 'vegetarian' };
            const recipes = await getRecipes(params);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('complexSearch'));
            expect(recipes).toEqual(mockResponse.data);
        });
    });

    describe('getRecipeInformation', () => {
        it('should fetch recipe information by id', async () => {
            const mockResponse = { data: { id: 1, title: 'Vegetarian Pizza' } };
            axios.get.mockResolvedValue(mockResponse);

            const recipeInfo = await getRecipeInformation(1);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/1/information'));
            expect(recipeInfo).toEqual(mockResponse.data);
        });
    });

    describe('getNutritionById', () => {
        it('should fetch nutrition information by recipe id', async () => {
            const mockResponse = { data: { calories: '500 kcal' } };
            axios.get.mockResolvedValue(mockResponse);

            const nutritionInfo = await getNutritionById(1);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/1/nutritionWidget.json'));
            expect(nutritionInfo).toEqual(mockResponse.data);
        });
    });

    describe('getIngredientsById', () => {
        it('should fetch ingredients by recipe id', async () => {
            const mockResponse = { data: { ingredients: ['dough', 'tomato sauce', 'cheese'] } };
            axios.get.mockResolvedValue(mockResponse);

            const ingredientsInfo = await getIngredientsById(1);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/1/ingredientWidget.json'));
            expect(ingredientsInfo).toEqual(mockResponse.data);
        });
    });

    describe('convertAmounts', () => {
        it('should convert ingredient amounts based on parameters', async () => {
            const mockResponse = { data: { targetAmount: 100, targetUnit: 'grams' } };
            axios.get.mockResolvedValue(mockResponse);

            const params = { ingredientName: 'sugar', sourceAmount: 1, sourceUnit: 'cup', targetUnit: 'grams' };
            const conversionResult = await convertAmounts(params);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('convert'));
            expect(conversionResult).toEqual(mockResponse.data);
        });
    });
});
