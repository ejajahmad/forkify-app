import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_TIME } from './config.js';

/* Control  Recipes / Get Recipe / Render Recipe */
const controlRecipes = async () => {
  try {
    // Get Recipe Id From URL
    const recipeID = window.location.hash.replace('#', '');
    if (!recipeID) return;

    // Render Spinner while recipe is loading
    recipeView.renderSpinner();

    // Loading recipe
    await model.loadRecipe(recipeID);

    // Rendering Recipe
    recipeView.render(model.state.recipe);

    // Update Search View & Bookmark View
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);
  } catch (error) {
    recipeView.renderError(error);
    console.error(error);
  }
};

/* Control  Search Results */
const controlSearchResults = async () => {
  try {
    // Render Spinner
    resultsView.renderSpinner();

    // Get query
    const query = searchView.getQuery();
    if (!query) return;

    //  Load data
    await model.loadSearchResults(query);
    if (!model.state.search.results.length)
      return resultsView.renderError(
        `No search results for <i>${query}</i>Please try for something else.`
      );

    //  Clear input
    searchView.clearInput();

    // Reset Pagination

    // Render Search Results
    resultsView.render(model.getSearchResultsPage());

    //  Render initial pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

/* Control Pagination in Results View */
const controlPagination = function (currentPage, action) {
  // Pagination Logic
  if (action === true) {
    resultsView.render(model.getSearchResultsPage(currentPage + 1));
  } else {
    resultsView.render(model.getSearchResultsPage(currentPage - 1));
  }

  // Render Pagination
  paginationView.render(model.state.search);
};

/* Control Servings In Recipe View */
const controlServings = function (servings) {
  model.updateServings(servings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
  console.log('Servings Updater');
};

const controlAddBookmark = function () {
  // Add / Remove Bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }

  // Update Bookmark
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  // Render Bookmark
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  // Render Bookmark
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner while recipe is uploading
    addRecipeView.renderSpinner();

    // Upload Recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Render Message
    addRecipeView.renderMessage();

    // Render Bookmark
    bookmarkView.render(model.state.bookmarks);

    // change current url to newRecipe.id
    // window.location.hash = model.state.recipe.id;
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    console.log('NEW RECIPE', newRecipe);
    // Close Form Modal
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_TIME);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error);
  }
};

// Initialize Controller
(function init() {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
})();
