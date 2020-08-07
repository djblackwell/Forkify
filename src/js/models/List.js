// 3rd party unique ID generator npm plugin
import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = []; // Array to contain all the addItem objects and store them
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);

        // i.e. [2, 4, 8] splice(1, 2); -> returns [4, 8] and original array is [2]
        // i.e. [2, 4, 8] slice(1, 2); -> returns 4 and original array is [2, 4, 8]

        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}