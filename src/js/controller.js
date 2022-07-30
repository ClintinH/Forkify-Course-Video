import * as model from './model.js';
import recipeView from './views/recipeview.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookMarksView.js';
import paginationView from './views/paginationview.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable'; // polyfilling everything
import 'regenerator-runtime/runtime'; //polyfilling async await

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  recipeView.renderSpinner();

  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Update results view to mark selected result
    resultsView.update(model.getSearchResultPage());

    // update bookmarks
    bookmarksView.update(model.state.bookmarks);

    console.log(id);
    // laoding recipe
    await model.loadRecipe(id);

    // rendeeing recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(`${err.message}`);
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // Get Search Queary
    const query = searchView.getQuery();
    if (!query) return;

    // Load Search Results
    await model.loadSearchResult(query);

    // Render Results
    // resultsView.render(model.state.search.result); // displayed all the search results
    resultsView.render(model.getSearchResultPage());

    // render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render new Results
  resultsView.render(model.getSearchResultPage(goToPage));

  // render new initial pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update serving of recipe in state
  model.updateServings(newServings);
  // Update recipe view
  // recipeView.render(model.state.recipe); // reloads entire page
  recipeView.update(model.state.recipe); // relaods only certain parts in the dom
};

const controlAddBookmark = function () {
  // add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);
  // update recipe view
  recipeView.update(model.state.recipe);
  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    //uplaod new recip
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // change id
    window.history.pushState(null, '', `${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdate(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
