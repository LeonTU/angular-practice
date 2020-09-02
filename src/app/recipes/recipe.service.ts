import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
@Injectable({
  providedIn: 'root'
})
export class RecipeService {
    recipesUpdated: Subject<Recipe[]> = new Subject<Recipe[]>();
    private recipes: Recipe[] = [
        new Recipe(
            'Recipe A',
            'good recipe',
            'https://p1.piqsels.com/preview/937/743/731/food-power-recipe-ingredient-pasta-tomato.jpg',
            [
                new Ingredient('Meat', 1),
                new Ingredient('French Fires', 20)
            ]
        ),
        new Recipe(
            'Recipe B',
            'good recipe',
            'https://cosmosmagazine.com/wp-content/uploads/2020/02/190502_panda_diet_full-1440x876.jpg',
            [
                new Ingredient('Buns', 2),
                new Ingredient('Meat', 1)
            ]
        )
    ];

    //recipeSelected = new EventEmitter<Recipe>();

    setRecipes(recipes: Recipe[]) {
      this.recipes = recipes;
      this.toUpdateRecipes();
    }

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes.slice()[index];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.toUpdateRecipes();
    }

    updateRecipe(index: number, recipe: Recipe) {
        this.recipes[index] = recipe;
        this.toUpdateRecipes();
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.toUpdateRecipes();
    }

    private toUpdateRecipes() {
        this.recipesUpdated.next(this.getRecipes());
    }

    // addIngredient(recipeIndex: number, newIngredient: Ingredient) {
    //     this.recipes[recipeIndex].ingredients.push(newIngredient);
    // }

    // removeIngredient(recipeIndex: number, ingredientIndex: number) {
    //     this.recipes[recipeIndex].ingredients.splice(ingredientIndex, 1);
    // }
}
