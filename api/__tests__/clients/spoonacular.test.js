const { getRecipes, getRecipeInformation, getNutritionById, getIngredientsById, convertAmounts } = require('../../clients/spoonacular');
const axios = require('axios');
const Cache = require('../../models/cache');

jest.mock('axios');
jest.mock('../../models/cache');

describe('Spoonacular API Client', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock Cache.findOne to return null (cache miss)
        Cache.findOne.mockResolvedValue(null);
        // Mock Cache.create to do nothing
        Cache.create.mockResolvedValue(undefined);
    });

    describe('getRecipes', () => {
        it('should fetch recipes based on parameters and cache successful responses', async () => {
            const mockResponse = { 
                status: 200,
                data: { results: [{ id: 1, title: 'Vegetarian Pizza' }] }
            };
            axios.get.mockResolvedValueOnce(mockResponse);

            const params = { diet: 'vegetarian' };
            const recipes = await getRecipes(params);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('complexSearch'));
            expect(Cache.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    response: mockResponse.data
                })
            );
            expect(recipes).toEqual(mockResponse.data);
        });

        it('should return cached data if available', async () => {
            const cachedData = { results: [{ id: 1, title: 'Cached Pizza' }] };
            Cache.findOne.mockResolvedValueOnce({ response: cachedData });

            const params = { diet: 'vegetarian' };
            const recipes = await getRecipes(params);

            expect(axios.get).not.toHaveBeenCalled();
            expect(recipes).toEqual(cachedData);
        });

        it('should not cache response when status is not 200', async () => {
            const mockResponse = { 
                status: 206,
                data: { results: [{ id: 1, title: 'Partial Content' }] }
            };
            axios.get.mockResolvedValueOnce(mockResponse);

            const params = { diet: 'vegetarian' };
            const recipes = await getRecipes(params);

            expect(Cache.create).not.toHaveBeenCalled();
            expect(recipes).toEqual(mockResponse.data);
        });
    });

    describe('getRecipeInformation', () => {
        it('should fetch recipe information by id', async () => {
            const mockResponse = { 
                status: 200,
                data: { id: 1, title: 'Vegetarian Pizza' }
            };
            axios.get.mockResolvedValueOnce(mockResponse);

            const recipeInfo = await getRecipeInformation(1);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/1/information'));
            expect(Cache.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    response: mockResponse.data
                })
            );
            expect(recipeInfo).toEqual(mockResponse.data);
        });
    });

    describe('getNutritionById', () => {
        it('should fetch nutrition information by recipe id', async () => {
            const mockResponse = { 
                status: 200,
                data: { calories: '500 kcal' }
            };
            axios.get.mockResolvedValueOnce(mockResponse);

            const nutritionInfo = await getNutritionById(1);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/1/nutritionWidget.json'));
            expect(Cache.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    response: mockResponse.data
                })
            );
            expect(nutritionInfo).toEqual(mockResponse.data);
        });
    });

    describe('getIngredientsById', () => {
        it('should fetch ingredients by recipe id', async () => {
            const mockResponse = { 
                status: 200,
                data: { ingredients: ['dough', 'tomato sauce', 'cheese'] }
            };
            axios.get.mockResolvedValueOnce(mockResponse);

            const ingredientsInfo = await getIngredientsById(1);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/1/ingredientWidget.json'));
            expect(Cache.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    response: mockResponse.data
                })
            );
            expect(ingredientsInfo).toEqual(mockResponse.data);
        });
    });

    describe('convertAmounts', () => {
        it('should convert ingredient amounts based on parameters', async () => {
            const mockResponse = { 
                status: 200,
                data: { targetAmount: 100, targetUnit: 'grams' }
            };
            axios.get.mockResolvedValueOnce(mockResponse);

            const params = { ingredientName: 'sugar', sourceAmount: 1, sourceUnit: 'cup', targetUnit: 'grams' };
            const conversionResult = await convertAmounts(params);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('convert'));
            expect(Cache.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    response: mockResponse.data
                })
            );
            expect(conversionResult).toEqual(mockResponse.data);
        });
    });
});
