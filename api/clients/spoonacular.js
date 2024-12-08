const axios = require('axios');
require('dotenv').config();
//get random api key

const tokens = ["d882bb96d42341f8adac644db865b895", "ac39c86344754b42a2631616de22597f", "548b233d65aa401fa856ce8277b0c958"]

function getNextToken() {
    const token = tokens.shift();
    tokens.push(token);
    return token;
}

const spoonacular_api_key = ()=>{
    return getNextToken();
}
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
        apiKey: spoonacular_api_key(),
        number: 5,
        instructionsRequired: true,
        ...params,
    });
    return await fetchData(url);
}

async function getRecipeInformation(id) {
    const recipeInformationUrl = `${SPOONACULAR_RECIPES_URL}/${id}/information`;
    const url = addQueryParams(recipeInformationUrl, {
        apiKey: spoonacular_api_key(),
    });
    return await fetchData(url);
}

async function getNutritionById(id) {
    const recipeInformationUrl = `${SPOONACULAR_RECIPES_URL}/${id}/nutritionWidget.json`;
    const url = addQueryParams(recipeInformationUrl, {
        apiKey: spoonacular_api_key(),
    });
    return await fetchData(url);
}

async function getIngredientsById(id) {
    const recipeInformationUrl = `${SPOONACULAR_RECIPES_URL}/${id}/ingredientWidget.json`;
    const url = addQueryParams(recipeInformationUrl, {
        apiKey: spoonacular_api_key(),
    });
    return await fetchData(url);
}

async function convertAmounts(params) {
    const convertAmountsUrl = `${SPOONACULAR_RECIPES_URL}/convert`;
    const url = addQueryParams(convertAmountsUrl, {
        apiKey: spoonacular_api_key(),
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
