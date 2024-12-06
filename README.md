# Setup

## Prerequisites

- Node.js (version 18 or later)
- Docker (for running the application in a containerized environment)
- MongoDB (or use the provided Docker setup)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the necessary environment variables (e.g., `MONGO_URI`, `JWT_SECRET`).

## Running the Application

### Locally

1. Start the application:
   ```bash
   npm start
   ```

2. The server will be running at `http://localhost:3000`.

### Using Docker

1. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```

2. The application will be accessible at `http://localhost:3000`.

# Testing

## Running Tests

1. To run the tests, use the following command:
   ```bash
   npm test
   ```

2. To generate a test coverage report:
   ```bash
   npm run test:coverage
   ```

## Continuous Integration

- The project uses GitHub Actions for continuous integration. The workflows are defined in the `.github/workflows` directory.

### Test Workflow

- The test workflow is triggered on pushes and pull requests to the `main` branch. It runs the tests using Node.js version 18.

### Coverage Workflow

- The coverage workflow checks the test coverage on pull requests to the `main` and `master` branches.

### SonarQube Analysis

- The SonarQube workflow is set up to analyze code quality on pushes to the `master` branch and on pull requests.

## Table of Contents
- [API Docs](#api-docs)
  - [Table of Contents](#table-of-contents)
- [Important](#important)
  - [GET /recipes](#get-recipes)
    - [Example](#example)
  - [GET /recipes/{recipe\_id}/info](#get-recipesrecipe_idinfo)
    - [Example](#example-1)
  - [GET /recipes/{recipe\_id}/nutrition](#get-recipesrecipe_idnutrition)
    - [Example](#example-2)
  - [POST /recipes/{recipe\_id}/register](#post-recipesrecipe_idregister)
    - [Example](#example-3)
  - [GET /recipes/generateByNutritionalGoals](#get-recipesgeneratebynutritionalgoals)
    - [Example](#example-4)
  - [POST /recipes/{recipe\_id}/favorite](#post-recipesrecipe_idfavorite)
    - [Example](#example-5)
  - [DELETE /recipes/{recipe\_id}/favorite](#delete-recipesrecipe_idfavorite)
    - [Example](#example-6)
  - [GET /recipes/favorites](#get-recipesfavorites)
    - [Example](#example-7)
  - [GET /recipes/lastConsumed](#get-recipeslastconsumed)
    - [Example](#example-8)
  - [GET /nutrition/dailyGoal](#get-nutritiondailygoal)
    - [Example](#example-9)
  - [POST /nutrition/dailyGoal](#post-nutritiondailygoal)
    - [Example](#example-10)
  - [GET /preferences](#get-preferences)
    - [Example](#example-11)
  - [POST /preferences](#post-preferences)
    - [Example](#example-12)
  - [GET /pantry](#get-pantry)
    - [Example](#example-13)
  - [POST /pantry/modifyIngredients](#post-pantrymodifyingredients)
    - [Example](#example-14)
  - [POST /pantry/updatePantry](#post-pantryupdatepantry)
    - [Example](#example-15)
- [POST /payment](#post-payment)
  - [Example](#example-16)
- [GET /payment/status?token\_ws={token}](#get-paymentstatustoken_wstoken)
  - [URL parameters](#url-parameters)
  - [Example](#example-17)
- [Appendix](#appendix)
  - [diets](#diets)
  - [intolerances](#intolerances)

# Important

All requests MUST have a JWT token in the Authorization header that contains the users email.

```json
{
  "email": "email@email.com"
}
```

If the email is not provided, the request will be rejected.

If the email was not found in the database, a new user will be created with the email provided.

## GET /recipes
Get a list of 5 recipes

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
            "id": 716426,
            "title": "Cauliflower, Brown Rice, and Vegetable Fried Rice",
            "image": "https://img.spoonacular.com/recipes/716426-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 715769,
            "title": "Broccolini Quinoa Pilaf",
            "image": "https://img.spoonacular.com/recipes/715769-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 663559,
            "title": "Tomato and lentil soup",
            "image": "https://img.spoonacular.com/recipes/663559-312x231.jpg",
            "imageType": "jpg"
        }
    ],
    "offset": 0,
    "number": 5,
    "totalResults": 649
}
```
## GET /recipes/{recipe_id}/info
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

## GET /recipes/{recipe_id}/nutrition
Get nutrition information about a recipe

### Example
```
Get /recipes/1003464/nutrition
```

```json
{
    "nutrients": [
        {
            "name": "Calories",
            "amount": 316.49,
            "unit": "kcal",
            "percentOfDailyNeeds": 15.82
        },
        {
            "name": "Fat",
            "amount": 12.09,
            "unit": "g",
            "percentOfDailyNeeds": 18.6
        },
        {
            "name": "Saturated Fat",
            "amount": 3.98,
            "unit": "g",
            "percentOfDailyNeeds": 24.88
        },
        {
            "name": "Carbohydrates",
            "amount": 49.25,
            "unit": "g",
            "percentOfDailyNeeds": 16.42
        },
        {
            "name": "Net Carbohydrates",
            "amount": 46.76,
            "unit": "g",
            "percentOfDailyNeeds": 17.0
        },
        {
            "name": "Sugar",
            "amount": 21.98,
            "unit": "g",
            "percentOfDailyNeeds": 24.42
        },
        {
            "name": "Cholesterol",
            "amount": 1.88,
            "unit": "mg",
            "percentOfDailyNeeds": 0.63
        },
        {
            "name": "Sodium",
            "amount": 279.1,
            "unit": "mg",
            "percentOfDailyNeeds": 12.13
        },
        {
            "name": "Protein",
            "amount": 3.79,
            "unit": "g",
            "percentOfDailyNeeds": 7.57
        },
       ...
    ],
    "properties": [
        {
            "name": "Glycemic Index",
            "amount": 33.51,
            "unit": ""
        },
        {
            "name": "Glycemic Load",
            "amount": 15.63,
            "unit": ""
        },
        {
            "name": "Nutrition Score",
            "amount": 5.868695652173913,
            "unit": "%"
        }
    ],
    "flavonoids": [
        {
            "name": "Cyanidin",
            "amount": 2.35,
            "unit": "mg"
        },
        {
            "name": "Petunidin",
            "amount": 8.75,
            "unit": "mg"
        },
        {
            "name": "Delphinidin",
            "amount": 9.83,
            "unit": "mg"
        },
       ...
    ],
    "ingredients": [
        {
            "id": 9050,
            "name": "blueberries",
            "amount": 0.19,
            "unit": "cups",
            "nutrients": [
                {
                    "name": "Vitamin E",
                    "amount": 0.16,
                    "unit": "mg",
                    "percentOfDailyNeeds": 3.19
                },
                {
                    "name": "Zinc",
                    "amount": 0.04,
                    "unit": "mg",
                    "percentOfDailyNeeds": 1.96
                },
                {
                    "name": "Fat",
                    "amount": 0.09,
                    "unit": "g",
                    "percentOfDailyNeeds": 18.6
                },
                {
                    "name": "Folate",
                    "amount": 1.66,
                    "unit": "µg",
                    "percentOfDailyNeeds": 9.48
                },
                {
                    "name": "Phosphorus",
                    "amount": 3.33,
                    "unit": "mg",
                    "percentOfDailyNeeds": 4.24
                },
                {
                    "name": "Manganese",
                    "amount": 0.09,
                    "unit": "mg",
                    "percentOfDailyNeeds": 18.69
                },
                ...
        },
        ...
    ],
    "caloricBreakdown": {
        "percentProtein": 4.72,
        "percentFat": 33.9,
        "percentCarbs": 61.38
    },
    "weightPerServing": {
        "amount": 138,
        "unit": "g"
    }
}
```

## POST /recipes/{recipe_id}/register
Register a recipe as consumed by the user on the current day

The `json` body is empty for this post request. Only the recipe id is needed.

### Example
```
POST /recipes/716406/register
```

```json
{}
```

## GET /recipes/generateByNutritionalGoals
Allows user to request recipes that aim to meet their daily macronutrients goal.
The "importance" of meeting the daily goal with the recipe can be established by using one of three levels of coverage (**URL parameter**): `very-low`, `low`, `medium`, `high`. The default level is `medium`.

`high` means that the recipe should cover the **entire** gap between current intake and daily goal. `medium` means that the recipe should cover (at least) **50%** of that gap. `low` means that the recipe should cover **25%** or more of that gap. `very-low` means that the recipe should cover **15%** or more of that gap.

Covering the gap means that the recipe should provide the user with the macronutrients that are missing from their daily goal. In the context of spoonacular, it sets the **minCalories**, **minProtein**, **minCarbs**, and **minFat** parameters to generate recipes that have at least that amount of macronutrients.

### Example
```
GET /recipes/generateByNutritionalGoals?coverage=low
```

```json
[
    {
        "id": 635675,
        "title": "Boozy Bbq Chicken",
        "image": "https://img.spoonacular.com/recipes/635675-312x231.jpg",
        "imageType": "jpg",
        "calories": 725,
        "protein": "32g",
        "fat": "33g",
        "carbs": "63g"
    },
    {
        "id": 640338,
        "title": "Cracked Wheat Salad with Dates & Tahini Yogurt",
        "image": "https://img.spoonacular.com/recipes/640338-312x231.jpg",
        "imageType": "jpg",
        "calories": 890,
        "protein": "32g",
        "fat": "48g",
        "carbs": "80g"
    },
    {
        "id": 651448,
        "title": "Mediterranean Watermelon Salad",
        "image": "https://img.spoonacular.com/recipes/651448-312x231.jpg",
        "imageType": "jpg",
        "calories": 762,
        "protein": "28g",
        "fat": "38g",
        "carbs": "80g"
    },
    {
        "id": 656795,
        "title": "Pork Patty Bánh Mì",
        "image": "https://img.spoonacular.com/recipes/656795-312x231.jpg",
        "imageType": "jpg",
        "calories": 1083,
        "protein": "53g",
        "fat": "60g",
        "carbs": "74g"
    },
    {
        "id": 660485,
        "title": "Soba Noodle & Five-Spice Pork Salad",
        "image": "https://img.spoonacular.com/recipes/660485-312x231.jpg",
        "imageType": "jpg",
        "calories": 915,
        "protein": "43g",
        "fat": "48g",
        "carbs": "82g"
    }
]
```
## POST /recipes/{recipe_id}/favorite
Post a recipe as favorite for that user. The recipe will be included in the user's favorites list.
The `json` body is empty for this post request. Only the recipe id is needed.

### Example
```
POST /recipes/716406/favorite
```

```json
{}
```

## DELETE /recipes/{recipe_id}/favorite
Delete a recipe from the user's favorites list.
Only the recipe id is needed.

### Example
```
DELETE /recipes/716406/favorite
```

```json
{}
```

## GET /recipes/favorites
Get the user's favorite recipes. Recives an optional `limit` parameter to limit the number of results. If no limit is provided, will default to 10.
The returned information includes the `recipe_id` and macros (`calories`, `carbs`, `fats`, `protein`).

### Example
```
GET /recipes/favorites
```

```json
[
    {
        "_id": "675118a38b13ca319fd43eeb",
        "user": "67072ee4ebf9511feb2bd695",
        "recipe_id": "715538",
        "__v": 0,
        "calories": 591,
        "carbs": 69,
        "createdAt": "2024-12-05T03:06:11.111Z",
        "fats": 13,
        "protein": 44,
        "updatedAt": "2024-12-05T03:06:11.111Z"
    },
    {
        "_id": "675115728b13ca319fd43ee9",
        "user": "67072ee4ebf9511feb2bd695",
        "recipe_id": "716429",
        "__v": 0,
        "calories": 543,
        "carbs": 83,
        "createdAt": "2024-12-05T02:52:34.064Z",
        "fats": 16,
        "protein": 16,
        "updatedAt": "2024-12-05T03:02:19.226Z"
    }
]
```

## GET /recipes/lastConsumed
Get the user's last consumed recipes (stored in `History`). Recives an optional `limit` parameter to limit the number of results. If no limit is provided, will default to 10.
The returned information includes the `recipe_id` and macros (`calories`, `carbs`, `fats`, `protein`).

### Example
```
GET /recipes/lastConsumed?limit=3
```

```json
[
    {
        "_id": "672e6a12e25aa6aa95e0c8cd",
        "user": "67072ee4ebf9511feb2bd695",
        "consumedAt": "2024-11-08T19:44:18.269Z",
        "recipe_id": "1003464",
        "protein": 11,
        "carbs": 111,
        "calories": 899,
        "createdAt": "2024-11-08T19:44:18.273Z",
        "updatedAt": "2024-11-08T19:44:18.273Z",
        "__v": 0
    },
    {
        "_id": "67084d7c510c01ba73607727",
        "user": "67072ee4ebf9511feb2bd695",
        "consumedAt": "2024-10-10T21:56:12.465Z",
        "recipe_id": "1003464",
        "protein": 11,
        "carbs": 111,
        "calories": 899,
        "createdAt": "2024-10-10T21:56:12.469Z",
        "updatedAt": "2024-10-10T21:56:12.469Z",
        "__v": 0
    },
    {
        "_id": "67084cf831baca9c8a36db2c",
        "user": "67072ee4ebf9511feb2bd695",
        "recipe_id": "1003464",
        "protein": 11,
        "carbs": 111,
        "calories": 899,
        "createdAt": "2024-10-10T21:54:00.212Z",
        "updatedAt": "2024-10-10T21:54:00.212Z",
        "__v": 0
    }
]
```

## GET /nutrition/dailyGoal
Get today's macronutrients goal and current intake

### Example
```
GET /nutrition/dailyGoal
```

```json
{
    "consumed": {
        "protein": 0,
        "carbs": 0,
        "fats": 0,
        "calories": 0
    },
    "goal": {
        "protein": 100,
        "carbs": 250,
        "fats": 100,
        "calories": 2900
    }
}
```

## POST /nutrition/dailyGoal
Create or update daily macronutrients goal

### Example
```
POST /nutrition/dailyGoal
```

```json
{
    "protein": "100",
    "carbs": "250",
    "fats": "100",
    "calories": "2900"
}
```

## GET /preferences
Get user preferences

### Example
```
GET /preferences
```

```json
{
    "_id": "670893d7067782131445d791",
    "user": "67072ee4ebf9511feb2bd695",
    "__v": 0,
    "createdAt": "2024-10-11T02:56:23.683Z",
    "diet": "vegan",
    "intolerances": [
        "peanut",
        "beans",
        "doritos"
    ],
    "updatedAt": "2024-10-11T03:02:04.776Z"
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

## GET /pantry
Get user pantry

### Example
```
GET /pantry
```

```json
[
    {
        "_id": "6729841f2fcd2d854b63b7ba",
        "user": "67072ee4ebf9511feb2bd695",
        "ingredients": [
            {
                "quantity": {
                    "amount": 29.92,
                    "unit": "tsp"
                },
                "name": "cinnamon",
                "_id": "67298a38c89365679ae37e3b"
            },
            {
                "quantity": {
                    "amount": 12,
                    "unit": "unit"
                },
                "name": "egg",
                "_id": "672aafa568234759a3e79627"
            },
            {
                "quantity": {
                    "amount": 24,
                    "unit": "unit"
                },
                "name": "apple",
                "_id": "672aafa568234759a3e79628"
            }
        ],
        "createdAt": "2024-11-05T02:34:07.584Z",
        "updatedAt": "2024-11-07T01:03:59.693Z",
        "__v": 6
    }
]
```

## POST /pantry/modifyIngredients
Add or subtract ingredients from user pantry.
The `json` body should contain an array of ingredients to add or remove. When the quantity is 0, the ingredient will be removed from the pantry.
If an ingredient is not found in the pantry, it will be added.

**IMPORTANT**: When storing an ingredient without a specific unit (e.g., 1 egg, 2 apples), ensure the unit field is left empty. This is because the Spoonacular API cannot convert from specific units to "no unit." However, it can convert from "no unit" to specific units (e.g., from 2 eggs to the equivalent amount in grams of eggs).

### Example
```
POST /pantry/modifyIngredients
```

```json
{
  "ingredients": [
      {
          "name": "cinnamon",
          "quantity": {
              "amount": -1,
              "unit": "cups"
          }
      },
      {
          "name": "egg",
          "quantity": {
              "amount": 1,
              "unit": "kg"
          }
      },
      {
          "name": "apple",
          "quantity": {
              "amount": 2,
              "unit": ""
          }
      }
  ]
}
```

## POST /pantry/updatePantry
Update the pantry with a new list of ingredients. This will replace the current pantry with the new list.
The posted `json` **overrides** the current pantry.

### Example
```
POST /pantry/updatePantry
```

```json
{
    "ingredients": [
        {
            "name": "cinnamon",
            "quantity": {
                "amount": 5,
                "unit": "g"
            }
        },
        {
            "name": "egg",
            "quantity": {
                "amount": 1.0,
                "unit": ""
            }
        },
        {
            "name": "apple",
            "quantity": {
                "amount": 2,
                "unit": "kg"
            }
        }
    ]
}
```

# POST /payment
Generate a payment link for the user to pay for the service

The `json` body is the return URL where the user will be redirected after the payment is completed.

## Example
```
POST /payment
```
```json
{
  returnUrl: "https://myapp.com/payment/success"
}
```

```json
{
	"redirect": "https://webpay3gint.transbank.cl/webpayserver/initTransaction?token_ws=01ab32137075c4cb6ed28f0f51524b2201afe80376458d07f0eac10d74070604"
}
```

# GET /payment/status?token_ws={token}
Get the payment status

## URL parameters
- `token_ws`: The token provided by the payment service

## Example
```
GET /payment/status?token_ws=01ab32137075c4cb6ed28f0f51524b2201afe80376458d07f0eac10d74070604
```

```json
{
	"vci": "TSN",
	"amount": 10000,
	"status": "INITIALIZED",
	"buy_order": "bjbcszemllbyvloormsympbrlm",
	"session_id": "lcmwkykavwxrmrepivpclbqseu",
	"card_detail": {
		"card_number": "6623"
	},
	"accounting_date": "1108",
	"transaction_date": "2024-11-08T19:26:36.362Z",
	"payment_type_code": "VN",
	"installments_number": 0
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
