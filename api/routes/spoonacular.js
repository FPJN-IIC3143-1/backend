const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()


const SPOONACULAR_API_KEY = "a4a518a1085c4cdcb8152365624f3de8"//process.env.SPOONACULAR_API_KEY;
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
        number: 5,
        instructionsRequired: true,
        ...params,
    });

    const response = await fetch(url)
    const data = await response.json();
    
    return data;
}

async function getRecipeByNutrients(params) {
    console.log(params)
    const findByNutrientsUrl = `${SPOONACULAR_RECIPES_URL}/findByNutrients`
    const url = addQueryParams(findByNutrientsUrl, {
        apiKey: SPOONACULAR_API_KEY,
        number: 5,
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

async function getIngredientsById(id) {
    const recipeInformationUrl = `${SPOONACULAR_RECIPES_URL}/${id}/ingredientWidget.json`
    const url = addQueryParams(recipeInformationUrl, {
        apiKey: SPOONACULAR_API_KEY,
    });

    const response = await fetch(url)
    const data = await response.json();
    
    return data;
}

async function convertAmounts(params) {
    const convertAmountsUrl = `${SPOONACULAR_RECIPES_URL}/convert`
    const url = addQueryParams(convertAmountsUrl, {
        apiKey: SPOONACULAR_API_KEY,
        ...params,
    });

    const response = await fetch(url)
    const data = await response.json();
    
    return data;
}

module.exports = {
    getRecipes,
    getRecipeInformation,
    getNutritionById,
    getIngredientsById,
    getRecipeByNutrients,
    convertAmounts
};