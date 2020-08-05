import Search from './models/Search';
import * as searchView from './views/searchView'; // imported functions from searchView
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
- Search Object
- Current Recipe Object
- Shopping list Object
- Likeed Recipes
*/
const state = {}; // start with an empty state on load

const controlSearch = async () => { // async so we can use await
    // 1. get query from view
    const query = searchView.getInput(); // Read the user input from input

    if(query) {
        // 2. Create new Search object and add to state variable
        state.search = new Search(query); // store the object in the Global state object 

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // 4. Search for recipes
        await state.search.getResults(); // Get results from the API call

        // 5. render results on UI
        clearLoader();
        searchView.renderResults(state.search.result); // Render the results on the DOM (UI)
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});