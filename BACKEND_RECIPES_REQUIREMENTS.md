# Backend Requirements for Recipes API

## Overview
This document outlines the backend requirements for the Recipes page functionality, specifically for handling external recipe searches via Spoonacular API.

## Current Frontend Implementation

### Endpoints Used

1. **GET `/recipes`** - Fetch all user's own recipes
   - Query parameters (optional):
     - `search` - Filter recipes by name/ingredients
     - `cuisine` - Filter by cuisine type
   - Returns: Array of recipe objects from user's database

2. **GET `/recipes/recipes`** - Search external recipes (Spoonacular)
   - Query parameters:
     - `recipe` - Recipe name or ingredients to search (required for search)
     - `cuisine` - Cuisine type filter (optional)
   - Returns: Array of external recipe objects with full details

3. **GET `/recipes/recipes/:id`** - Get detailed information for a specific external recipe
   - Used when viewing an external recipe that needs full details

## Backend Implementation Requirements

### Why Backend?
The Spoonacular API integration should be handled in the backend because:
1. **Security**: API keys must remain server-side and never exposed to clients
2. **Rate Limiting**: Better control over API call limits
3. **Caching**: Ability to cache results server-side
4. **Data Normalization**: Consistent data format regardless of source
5. **Error Handling**: Centralized error handling and fallbacks

### Required Spoonacular Endpoints

#### 1. Search Recipes Endpoint
- **Spoonacular Endpoint**: `GET /recipes/complexSearch`
- **Purpose**: Find recipes matching search criteria
- **Returns**: List of recipes with basic info (id, title, image)

**Example Request:**
```
GET https://api.spoonacular.com/recipes/complexSearch?query=spaghetti&cuisine=italian&number=10
```

**Expected Query Parameters from Frontend:**
- `recipe` - Search query (recipe name or ingredients)
- `cuisine` - Cuisine filter (optional)
- `number` - Number of results (optional, default: 10)

#### 2. Recipes Information Bulk Endpoint
- **Spoonacular Endpoint**: `GET /recipes/informationBulk`
- **Purpose**: Get detailed information for multiple recipes by their IDs
- **Returns**: Array of full recipe objects with ingredients, instructions, servings, etc.

**Example Request:**
```
GET https://api.spoonacular.com/recipes/informationBulk?ids=715538,716429&includeNutrition=false
```

**Note**: The bulk endpoint accepts comma-separated recipe IDs.

### Backend API Endpoint Structure

#### Endpoint: `GET /recipes/recipes`

**Query Parameters:**
- `recipe` (required) - Search query
- `cuisine` (optional) - Cuisine filter
- `number` (optional, default: 10) - Number of results

**Backend Logic:**
1. Receive search parameters from frontend
2. Call Spoonacular `complexSearch` endpoint with parameters
3. Extract recipe IDs from search results
4. Call Spoonacular `informationBulk` endpoint with recipe IDs
5. Normalize and transform the data to match frontend expectations
6. Return normalized recipe array

**Expected Response Format:**
```json
{
  "data": [
    {
      "id": 715538,
      "title": "Spaghetti with Meatballs",
      "image": "https://spoonacular.com/recipeImages/715538-312x231.jpg",
      "servings": 4,
      "instructions": "Step 1... Step 2...",
      "ingredients": [
        {
          "ingredient": "spaghetti",
          "amount": "1",
          "unit": "pound"
        },
        {
          "ingredient": "ground beef",
          "amount": "1",
          "unit": "pound"
        }
      ]
    }
  ]
}
```

**Data Normalization Requirements:**
- Map Spoonacular's `extendedIngredients` to `ingredients` array with `ingredient`, `amount`, `unit`
- Extract instructions from `analyzedInstructions` array (array of step objects)
- Map `yield` or `servings` to consistent `servings` field
- Ensure all fields are present (use empty strings/arrays for missing data)

#### Endpoint: `GET /recipes/recipes/:id`

**Purpose**: Get detailed information for a single external recipe

**Backend Logic:**
1. Receive recipe ID
2. Call Spoonacular `GET /recipes/{id}/information` endpoint
3. Normalize and transform the data
4. Return normalized recipe object

**Expected Response Format:**
```json
{
  "data": {
    "id": 715538,
    "title": "Spaghetti with Meatballs",
    "image": "https://spoonacular.com/recipeImages/715538-312x231.jpg",
    "servings": 4,
    "instructions": "Step 1... Step 2...",
    "ingredients": [...]
  }
}
```

### Error Handling

The backend should handle:
1. **Spoonacular API Errors**: Return appropriate error messages
2. **Missing Parameters**: Validate required parameters
3. **Rate Limits**: Handle API rate limiting gracefully
4. **Empty Results**: Return empty array instead of error

**Error Response Format:**
```json
{
  "error": "Error message here",
  "status": 500
}
```

### Frontend Expectations

The frontend expects:
1. **Consistent Data Structure**: Whether from own book or external, recipes should have the same structure
2. **Array Response**: `/recipes/recipes` should return an array (or object with `data` array)
3. **Complete Data**: External recipes should include all fields: id, title, image, servings, instructions, ingredients

### Implementation Notes

1. **Environment Variables**: Store Spoonacular API key in backend environment variables
2. **Caching**: Consider caching search results to reduce API calls
3. **Rate Limiting**: Implement rate limiting to stay within Spoonacular free tier limits
4. **Batch Processing**: Use bulk endpoint efficiently - batch multiple IDs in single call
5. **Timeout Handling**: Set reasonable timeouts for external API calls

### Testing Checklist

- [ ] Search with recipe name only
- [ ] Search with recipe name and cuisine
- [ ] Search returns empty array when no results
- [ ] Recipe details include all required fields
- [ ] Instructions are properly formatted
- [ ] Ingredients are properly structured
- [ ] Error handling works for API failures
- [ ] Rate limiting is handled gracefully

## Current Frontend Code References

- **URL Construction**: `src/services/recipes/getRecipesUrl.js`
- **Recipe Fetching**: `src/components/Recipes/RecipesCard.js`
- **Recipe Display**: `src/components/Recipes/RecipeDet.js`
- **Recipe View**: `src/components/Recipes/RecipeView.js`

## Spoonacular API Documentation

- Search Recipes: https://spoonacular.com/food-api/docs#Search-Recipes-Complex
- Recipe Information Bulk: https://spoonacular.com/food-api/docs#Get-Recipe-Information-Bulk
- Recipe Information: https://spoonacular.com/food-api/docs#Get-Recipe-Information

