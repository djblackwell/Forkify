import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView'; // imported functions from searchView
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
- Search Object
- Current Recipe Object
- Shopping list Object
- Liked Recipes
*/
const state = {}; // start with an empty state on load
window.state = state;

//*** SEARCH CONTROLLER ***//
const controlSearch = async () => { // async so we can use await
    // 1. get query from view
    const query = searchView.getInput(); // Read the user input from input
    //const query = 'pizza';

    if(query) {
        // 2. Create new Search object and add to state variable
        state.search = new Search(query); // store the object in the Global state object 

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes
            await state.search.getResults(); // Get results from the API call

            // 5. render results on UI
            clearLoader();
            searchView.renderResults(state.search.result); // Render the results on the DOM (UI)
        } catch (err) {
            alert('Error, something wrong with search...!');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

//*** RECIPE CONTROLLER ***//
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', ''); // get id from url and replace hash

    if (id) {
        // Prepare the UI for changes 
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight saelected search item
        if (state.search) searchView.highlightedSelected(id);

        // Create new Recipe Object
        state.recipe = new Recipe(id); // crete new object and store in state []
        
        try {
            // Get recipe Data and Parse ingredients
            await state.recipe.getRecipe(); // returns promise once complete 
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime(); // calculate time and servings
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (err) {
            console.log(err);
            alert('Error Processing Recipe!');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//*** LIST CONTROLLER ***//
const controlList = () => {
    // create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button 
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state 
        state.list.deleteItem(id);

        // delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

//*** LIKES CONTROLLER ***//

// TESTING
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {

        // Add like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle 'like' button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User has liked current recipe
    } else {

        // Remove like from state
        state.likes.deleteLike(currentID);

        // Toggle 'like' button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Handling Recipe button clicks 'inc', 'dec'
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});

window.l = new List();