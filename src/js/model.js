import { async } from 'regenerator-runtime';
import { API_KEY, API_URL } from './config';
import { RESULTS_PER_PAGE } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = data => {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    console.log(state.recipe);
  } catch (error) {
    console.error('Something went wrong', error);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const response = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = response.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    state.search.page = 1;
  } catch (error) {
    console.error('Something went wrong', error);
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // if page 1, 1 - 1 = 0 * 10 = 0
  const end = page * state.search.resultsPerPage; // if page 1, 1 * 10 = 10
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
  });
  state.recipe.servings = newServings;
};

const storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const loadBookmarks = function () {
  if (localStorage.getItem('bookmarks')) {
    state.bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  }
};

export const addBookmark = function (recipe) {
  // Add Bookmark
  state.bookmarks.push(recipe);

  // Mark Bookmark in recipe
  if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;

  // Store Bookmark in Local Storage
  storeBookmarks();
};

export const removeBookmark = function (id) {
  // Find Index
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);

  // Remove Recipe
  state.bookmarks.splice(index, 1);

  // Mark Bookmark in recipe
  if (state.recipe.id === id) state.recipe.bookmarked = false;

  storeBookmarks();
};

// const getIngredients = recipe => {};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1].length)
      .map(ing => {
        // const ingArray = ing[1].replaceAll(' ', '').split(',');
        const ingArray = ing[1].split(',').map(entry => entry.trim());
        if (ingArray.length !== 3)
          throw new Error(
            "Wrong ingredients format. Please use the correct format: 'Quantity', 'Unit', 'Name'"
          );
        const [quantity, unit, description] = ingArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

/* -------------------- */

// Initialize Model
(function init() {
  loadBookmarks();
})();
