import { Ingredient } from './../shared/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {
    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    ingredientsUpdated = new Subject<Ingredient[]>();
    editMode = new Subject<number>();

    constructor() { }

    addIngredients(ingredient: Ingredient[]) {
        this.ingredients.push(...ingredient);
        this.ingredientsUpdated.next(this.ingredients.slice());
    }

    getIngredient(index: number) {
        return (this.getIngredients())[index];
    }

    getIngredients() {
        return this.ingredients.slice();
    }

    updateIngredient(index: number, ingredient: Ingredient) {
        this.ingredients[index] = ingredient;
        this.ingredientsUpdated.next(this.ingredients.slice());
    }

    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientsUpdated.next(this.ingredients.slice());
    }

    enterEditMode(index: number) {
        this.editMode.next(index);
    }

    leaveEditMode(): void {
        this.editMode.next(-1);
    }
}