const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_URL = "https://api.spoonacular.com/recipes"

export function getRecipes() {
    const complexSearchUrl = `${SPOONACULAR_URL}/complexSearch`
    const url = addQueryParams(complexSearchUrl, {
        apiKey: SPOONACULAR_API_KEY,
    });

    console.log(url);
   
}

function addQueryParams(url_string, queryParams) {
    const url = new URL(url_string);
    for (const key in queryParams) {
        url.searchParams.append(key, queryParams[key]);
    }
    return url.toString();
}

getRecipes();