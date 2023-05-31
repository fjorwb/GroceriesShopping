require('dotenv').config()
const fs = require('fs')

const axios = require('axios')

const RapidAPI_Key = process.env.RAPIDAPI_KEY
const RapidAPI_Host = process.env.RAPIDAPI_HOST

console.log(RapidAPI_Key, RapidAPI_Host)

const data = require('./mockRecipesCopy.json')

let idext = 0
const recipes = []
const ingredients = []
let counter = 0

function list(data) {
  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    recipes.push(element.id)
  }
}

list(data)
console.log(recipes)

async function getIngredients(idext) {
  const checkIngredient = ingredients.find(
    (ingredient) => ingredient.idext === idext
  )

  if (checkIngredient) {
    console.log('ingredients already exists')
  } else {
    counter++
    // console.log('ingredient does not exist')
    console.log('counter', counter, checkIngredient)

    // console.log(RapidAPI_Key, RapidAPI_Host)

    const options = {
      method: 'GET',
      url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${idext}/information`,
      params: {includeNutrition: 'false'},
      headers: {
        // 'X-RapidAPI-Key': RapidAPI_Key,
        // 'X-RapidAPI-Host': RapidAPI_Host
        'X-RapidAPI-Key': 'acdc420992msh4ffbe009ed40816p166414jsn27bda9718d84',
        'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
      }
    }

    const body = await axios
      .request(options)
      .then(function (response) {
        const resp2 = response.data
        const {id, extendedIngredients, servings, instructions} = resp2
        return {
          idext: id,
          ingredients: extendedIngredients,
          servings,
          instructions
        }
      })
      .catch((err) => {
        console.log(err)
      })

    // ingredients.push({
    //   idext: body.idext,
    //   ingredients: body.ingredients,
    //   servings: body.servings,
    //   instructions: body.instructions
    // })

    // ingredients.push(body)
    return {
      idext: body.idext,
      ingredients: body.ingredients,
      servings: body.servings,
      instructions: body.instructions
    }
  }
  // console.log(ingredients)
}

async function loopForIngredients(data) {
  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    idext = element.id
    console.log(idext)
    const x = await getIngredients(idext)
    // console.log('X', x)
    ingredients.push(x)
  }
  // console.log('INGR', ingredients)
  convertToJSON(ingredients)
}

loopForIngredients(data)

// console.log('ING', ingredients)

function convertToJSON(ingredients) {
  const json = JSON.stringify(ingredients, null, 2)
  fs.writeFile('ingredients.json', json, (err) => {
    if (err) {
      console.error('Error writing JSON file:', err)
    } else {
      console.log('JSON file created successfully.')
    }
  })
}

// convertToJSON(ingredients)
