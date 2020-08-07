import axios from 'axios';                  // always import at start

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log (this.result);    // Testing
        } catch (error) {
            alert(error);
        }
    }
}