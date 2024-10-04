# API Docs

## Table of Contents
- [API Docs](#api-docs)
  - [Table of Contents](#table-of-contents)
  - [GET /recipes](#get-recipes)
    - [Example](#example)
  - [GET /recipes/{id}/info](#get-recipesidinfo)
    - [Example](#example-1)
  - [POST /preferences](#post-preferences)
    - [Example](#example-2)
- [Appendix](#appendix)
  - [diets](#diets)
  - [intolerances](#intolerances)

## GET /recipes
Get a list of 3 recipes

Parameters supported:
- [diet](#diets)
- [intolerances](#intolerances)

If no parameters are provided, will default to user preferences (if found).

### Example
```
GET /recipes?diet=vegan&intolerances=peanut,soy,egg
```
Response:
```json
{
  "results": [
    {
      "id": 716406,
      "title": "Asparagus and Pea Soup: Real Convenience Food",
      "image": "https://img.spoonacular.com/recipes/716406-312x231.jpg",
      "imageType": "jpg"
    },
    {
      "id": 644387,
      "title": "Garlicky Kale",
      "image": "https://img.spoonacular.com/recipes/644387-312x231.jpg",
      "imageType": "jpg"
    },
    {
      "id": 782601,
      "title": "Red Kidney Bean Jambalaya",
      "image": "https://img.spoonacular.com/recipes/782601-312x231.jpg",
      "imageType": "jpg"
    }
  ],
  "offset": 0,
  "number": 3,
  "totalResults": 643
}
```
## GET /recipes/{id}/info
Get detailed information about a recipe

### Example
```
GET /recipes/716406/info
```

```json
{
  "vegetarian": true,
  "vegan": true,
  "glutenFree": true,
  "dairyFree": true,
  "veryHealthy": true,
  "cheap": false,
  "veryPopular": false,
  "sustainable": false,
  "lowFodmap": false,
  "weightWatcherSmartPoints": 2,
  "gaps": "GAPS_4",
  "preparationMinutes": null,
  "cookingMinutes": null,
  "aggregateLikes": 207,
  "healthScore": 100,
  "creditsText": "Full Belly Sisters",
  "license": "CC BY-SA 3.0",
  "sourceName": "Full Belly Sisters",
  "pricePerServing": 178.37,
  "extendedIngredients": [
    {
      "id": 11011,
      "aisle": "Produce",
      "image": "asparagus.png",
      "consistency": "SOLID",
      "name": "asparagus",
      "nameClean": "asparagus",
      "original": "1 bag of frozen organic asparagus (preferably thawed)",
      "originalName": "frozen organic asparagus (preferably thawed)",
      "amount": 1,
      "unit": "bag",
      "meta": [
        "frozen",
        "organic",
        "thawed",
        "(preferably )"
      ],
      "measures": {
        "us": {
          "amount": 1,
          "unitShort": "bag",
          "unitLong": "bag"
        },
        "metric": {
          "amount": 1,
          "unitShort": "bag",
          "unitLong": "bag"
        }
      }
    },
    {
      "id": 1034053,
      "aisle": "Oil, Vinegar, Salad Dressing",
      "image": "olive-oil.jpg",
      "consistency": "LIQUID",
      "name": "evoo",
      "nameClean": "extra virgin olive oil",
      "original": "1T EVOO (extra virgin olive oil)",
      "originalName": "EVOO (extra virgin olive oil)",
      "amount": 1,
      "unit": "T",
      "meta": [
        "(extra virgin olive oil)"
      ],
      "measures": {
        "us": {
          "amount": 1,
          "unitShort": "Tbsp",
          "unitLong": "Tbsp"
        },
        "metric": {
          "amount": 1,
          "unitShort": "Tbsp",
          "unitLong": "Tbsp"
        }
      }
    },
    {
      "id": 11215,
      "aisle": "Produce",
      "image": "garlic.png",
      "consistency": "SOLID",
      "name": "garlic",
      "nameClean": "garlic",
      "original": "a couple of garlic cloves",
      "originalName": "a couple of garlic",
      "amount": 2,
      "unit": "cloves",
      "meta": [],
      "measures": {
        "us": {
          "amount": 2,
          "unitShort": "cloves",
          "unitLong": "cloves"
        },
        "metric": {
          "amount": 2,
          "unitShort": "cloves",
          "unitLong": "cloves"
        }
      }
    },
    {
      "id": 11282,
      "aisle": "Produce",
      "image": "brown-onion.png",
      "consistency": "SOLID",
      "name": "onion",
      "nameClean": "onion",
      "original": "1/2 onion",
      "originalName": "onion",
      "amount": 0.5,
      "unit": "",
      "meta": [],
      "measures": {
        "us": {
          "amount": 0.5,
          "unitShort": "",
          "unitLong": ""
        },
        "metric": {
          "amount": 0.5,
          "unitShort": "",
          "unitLong": ""
        }
      }
    },
    {
      "id": 11304,
      "aisle": "Produce",
      "image": "peas.jpg",
      "consistency": "SOLID",
      "name": "peas",
      "nameClean": "petite peas",
      "original": "2-3c of frozen organic peas",
      "originalName": "frozen organic peas",
      "amount": 2,
      "unit": "c",
      "meta": [
        "frozen",
        "organic"
      ],
      "measures": {
        "us": {
          "amount": 2,
          "unitShort": "cups",
          "unitLong": "cups"
        },
        "metric": {
          "amount": 290,
          "unitShort": "g",
          "unitLong": "grams"
        }
      }
    },
    {
      "id": 99253,
      "aisle": "Canned and Jarred",
      "image": "chicken-broth.png",
      "consistency": "LIQUID",
      "name": "vegetable broth",
      "nameClean": "low sodium vegetable broth",
      "original": "1 box low-sodium vegetable broth",
      "originalName": "low-sodium vegetable broth",
      "amount": 1,
      "unit": "box",
      "meta": [
        "low-sodium"
      ],
      "measures": {
        "us": {
          "amount": 1,
          "unitShort": "box",
          "unitLong": "box"
        },
        "metric": {
          "amount": 1,
          "unitShort": "box",
          "unitLong": "box"
        }
      }
    }
  ],
  "id": 716406,
  "title": "Asparagus and Pea Soup: Real Convenience Food",
  "readyInMinutes": 20,
  "servings": 2,
  "sourceUrl": "https://fullbellysisters.blogspot.com/2011/03/asparagus-and-pea-soup-real-convenience.html",
  "image": "https://img.spoonacular.com/recipes/716406-556x370.jpg",
  "imageType": "jpg",
  "summary": "Asparagus and Pea Soup: Real Convenience Food requires approximately <b>20 minutes</b> from start to finish. Watching your figure? This gluten free, dairy free, paleolithic, and lacto ovo vegetarian recipe has <b>217 calories</b>, <b>11g of protein</b>, and <b>8g of fat</b> per serving. This recipe serves 2. For <b>$1.78 per serving</b>, this recipe <b>covers 25%</b> of your daily requirements of vitamins and minerals. <b>Autumn</b> will be even more special with this recipe. It works well as a hor d'oeuvre. 207 people have tried and liked this recipe. It is brought to you by fullbellysisters.blogspot.com. A mixture of vegetable broth, evoo, garlic, and a handful of other ingredients are all it takes to make this recipe so yummy. All things considered, we decided this recipe <b>deserves a spoonacular score of 96%</b>. This score is outstanding. Try <a href=\"https://spoonacular.com/recipes/asparagus-and-pea-soup-real-convenience-food-1393979\">Asparagus and Pea Soup: Real Convenience Food</a>, <a href=\"https://spoonacular.com/recipes/asparagus-and-pea-soup-real-convenience-food-1376201\">Asparagus and Pea Soup: Real Convenience Food</a>, and <a href=\"https://spoonacular.com/recipes/asparagus-and-pea-soup-real-convenience-food-1362341\">Asparagus and Pea Soup: Real Convenience Food</a> for similar recipes.",
  "cuisines": [],
  "dishTypes": [
    "antipasti",
    "soup",
    "starter",
    "snack",
    "appetizer",
    "antipasto",
    "hor d'oeuvre"
  ],
  "diets": [
    "gluten free",
    "dairy free",
    "paleolithic",
    "lacto ovo vegetarian",
    "primal",
    "vegan"
  ],
  "occasions": [
    "fall",
    "winter"
  ],
  "instructions": "<ol><li><span></span>Chop the garlic and onions.</li><li>Saute the onions in the EVOO, adding the garlic after a couple of minutes; cook until the onions are translucent. </li><li>Add the whole bag of asparagus and cover everything with the broth. </li><li>Season with salt and pepper and a pinch of red pepper flakes, if using.</li><li>Simmer until the asparagus is bright green and tender (if you've thawed the asparagus it will only take a couple of minutes). </li><li>Turn off the heat and puree using an immersion blender.</li><li>Add peas (the heat of the soup will quickly thaw them) and puree until smooth; add more until it reaches the thickness you like.</li><li>Top with chives and a small dollop of creme fraiche <span class=\"Apple-style-span\" style=\"background-color: initial; font-family: inherit; color: rgb(77, 77, 77);\">or sour cream or greek yogurt.</span></li></ol><span class=\"Apple-style-span\"></span>",
  "analyzedInstructions": [
    {
      "name": "",
      "steps": [
        {
          "number": 1,
          "step": "Chop the garlic and onions.",
          "ingredients": [
            {
              "id": 11215,
              "name": "garlic",
              "localizedName": "garlic",
              "image": "garlic.png"
            },
            {
              "id": 11282,
              "name": "onion",
              "localizedName": "onion",
              "image": "brown-onion.png"
            }
          ],
          "equipment": []
        },
        {
          "number": 2,
          "step": "Saute the onions in the EVOO, adding the garlic after a couple of minutes; cook until the onions are translucent.",
          "ingredients": [
            {
              "id": 11215,
              "name": "garlic",
              "localizedName": "garlic",
              "image": "garlic.png"
            },
            {
              "id": 11282,
              "name": "onion",
              "localizedName": "onion",
              "image": "brown-onion.png"
            },
            {
              "id": 1034053,
              "name": "extra virgin olive oil",
              "localizedName": "extra virgin olive oil",
              "image": "olive-oil.jpg"
            }
          ],
          "equipment": []
        },
        {
          "number": 3,
          "step": "Add the whole bag of asparagus and cover everything with the broth. Season with salt and pepper and a pinch of red pepper flakes, if using.Simmer until the asparagus is bright green and tender (if you've thawed the asparagus it will only take a couple of minutes). Turn off the heat and puree using an immersion blender.",
          "ingredients": [
            {
              "id": 1032009,
              "name": "red pepper flakes",
              "localizedName": "red pepper flakes",
              "image": "red-pepper-flakes.jpg"
            },
            {
              "id": 1102047,
              "name": "salt and pepper",
              "localizedName": "salt and pepper",
              "image": "salt-and-pepper.jpg"
            },
            {
              "id": 11011,
              "name": "asparagus",
              "localizedName": "asparagus",
              "image": "asparagus.png"
            },
            {
              "id": 1006615,
              "name": "broth",
              "localizedName": "broth",
              "image": "chicken-broth.png"
            }
          ],
          "equipment": [
            {
              "id": 404776,
              "name": "immersion blender",
              "localizedName": "immersion blender",
              "image": "https://spoonacular.com/cdn/equipment_100x100/immersion-blender.png"
            }
          ]
        },
        {
          "number": 4,
          "step": "Add peas (the heat of the soup will quickly thaw them) and puree until smooth; add more until it reaches the thickness you like.Top with chives and a small dollop of creme fraiche or sour cream or greek yogurt.",
          "ingredients": [
            {
              "id": 1001056,
              "name": "creme fraiche",
              "localizedName": "creme fraiche",
              "image": "sour-cream.jpg"
            },
            {
              "id": 1256,
              "name": "greek yogurt",
              "localizedName": "greek yogurt",
              "image": "plain-yogurt.jpg"
            },
            {
              "id": 1056,
              "name": "sour cream",
              "localizedName": "sour cream",
              "image": "sour-cream.jpg"
            },
            {
              "id": 11156,
              "name": "chives",
              "localizedName": "chives",
              "image": "fresh-chives.jpg"
            },
            {
              "id": 11304,
              "name": "peas",
              "localizedName": "peas",
              "image": "peas.jpg"
            },
            {
              "id": 0,
              "name": "soup",
              "localizedName": "soup",
              "image": ""
            }
          ],
          "equipment": []
        }
      ]
    }
  ],
  "originalId": null,
  "spoonacularScore": 99.41413116455078,
  "spoonacularSourceUrl": "https://spoonacular.com/asparagus-and-pea-soup-real-convenience-food-716406"
}
```

## POST /preferences
Set user preferences

Parameters supported:
- [diet](#diets)
- [intolerances](#intolerances)

### Example
```
POST /preferences
```
```json
{
"diet": "vegan",
"intolerances": ["peanut", "soy", "egg"]
}
```



# Appendix
## diets
- gluten free
- ketogenic
- vegetarian
- lacto-vegetarian
- ovo-vegetarian
- vegan
- pescetarian
- paleo
- primal
- low fodmap
- whole30

## intolerances
- dairy
- egg
- gluten
- grain
- peanut
- seafood
- sesame
- shellfish
- soy
- sulfite
- tree nut
- wheat

