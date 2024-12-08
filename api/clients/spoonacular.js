const axios = require('axios');
require('dotenv').config();

const SPOONACULAR_API_KEY = "0236a8be63ae493d9f03b2e24ae478b5"; //process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_RECIPES_URL = "https://api.spoonacular.com/recipes";

function addQueryParams(url_string, queryParams) {
    const url = new URL(url_string);
    for (const key in queryParams) {
        url.searchParams.append(key, queryParams[key]);
    }
    return url.toString();
}

async function fetchData(url) {
    const response = await axios.get(url);
    return response.data;
}

async function getRecipes(params) {
    const complexSearchUrl = `${SPOONACULAR_RECIPES_URL}/complexSearch`;
    const url = addQueryParams(complexSearchUrl, {
        apiKey: SPOONACULAR_API_KEY,
        number: 5,
        instructionsRequired: true,
        ...params,
    });
    return await fetchData(url);
}

async function getRecipeInformation(id) {
    const recipeInformationUrl = `${SPOONACULAR_RECIPES_URL}/${id}/information`;
    const url = addQueryParams(recipeInformationUrl, {
        apiKey: SPOONACULAR_API_KEY,
    });
    return await fetchData(url);
}

async function getNutritionById(id) {
    const recipeInformationUrl = `${SPOONACULAR_RECIPES_URL}/${id}/nutritionWidget.json`;
    const url = addQueryParams(recipeInformationUrl, {
        apiKey: SPOONACULAR_API_KEY,
    });
    return await fetchData(url);
}

async function getIngredientsById(id) {
    const recipeInformationUrl = `${SPOONACULAR_RECIPES_URL}/${id}/ingredientWidget.json`;
    const url = addQueryParams(recipeInformationUrl, {
        apiKey: SPOONACULAR_API_KEY,
    });
    return await fetchData(url);
}

async function convertAmounts(params) {
    const convertAmountsUrl = `${SPOONACULAR_RECIPES_URL}/convert`;
    const url = addQueryParams(convertAmountsUrl, {
        apiKey: SPOONACULAR_API_KEY,
        ...params,
    });
    return await fetchData(url);
}

module.exports = {
    getRecipes,
    getRecipeInformation,
    getNutritionById,
    getIngredientsById,
    convertAmounts
};
