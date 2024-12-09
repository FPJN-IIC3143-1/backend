const axios = require('axios');
require('dotenv').config();
const Cache = require('../models/cache');
//get random api key

const tokens = ["a03a61ff8a8049898406de0256d4bdbe", "371958f8948d40cdb97ecbb522caccd1",
                "c6f8431b64fa44218a1d8eafd8f7b2f2", "81d72543535d445ab1ff501eceb7774b",
                "670d91726b134b24a67b3234c0720d06", "3b01f9c4f9d1485796cdde5698a78463",
                "14651d780937453fb660392ec37120a1", "a2be48bc0a404f54a6bf244845cb617d"]

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


    const cached = await Cache.findOne({ url })
    if (cached) {
        console.log('Cache hit for url:', url);
        return cached.response;
    }

    const response = await axios.get(url);
    if (response.status === 200) 
        await Cache.create({ url, response: response.data });
    

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
