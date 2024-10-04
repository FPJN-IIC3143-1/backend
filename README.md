# API Docs

## Table of Contents
- [API Docs](#api-docs)
  - [Table of Contents](#table-of-contents)
  - [GET /recipes](#get-recipes)
    - [Example](#example)
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

