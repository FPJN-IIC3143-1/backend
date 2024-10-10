const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()


const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_RECIPES_URL = "https://api.spoonacular.com/recipes"

function addQueryParams(url_string, queryParams) {
    const url = new URL(url_string);
    for (const key in queryParams) {
        url.searchParams.append(key, queryParams[key]);
    }
    return url.toString();
}

async function getRecipes(params) {
    const complexSearchUrl = `${SPOONACULAR_RECIPES_URL}/complexSearch`
    const url = addQueryParams(complexSearchUrl, {
        apiKey: SPOONACULAR_API_KEY,
        number: 3,
        instructionsRequired: true,
        ...params,
    });

    const response = await fetch(url)
    const data = await response.json();
    
    return data;
}

async function getRecipeInformation(id) {
    const recipeInformationUrl = `${SPOONACULAR_RECIPES_URL}/${id}/information`
    const url = addQueryParams(recipeInformationUrl, {
        apiKey: SPOONACULAR_API_KEY,
    });

    const response = await fetch(url)
    const data = await response.json();
    
    return data;
}

async function getNutritionById(id) {
    const recipeInformationUrl = `${SPOONACULAR_RECIPES_URL}/${id}/nutritionWidget.json`
    const url = addQueryParams(recipeInformationUrl, {
        apiKey: SPOONACULAR_API_KEY,
    });

    const response = await fetch(url)
    const data = await response.json();
    
    return data;
}

module.exports = {
    getRecipes,
    getRecipeInformation,
    getNutritionById
};