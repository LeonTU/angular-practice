import { Subscription } from 'rxjs';
import { RecipeService } from './../recipe.service';
import { ShoppingListService } from './../../shopping-list/shopping-list.service';
import { Ingredient } from './../../shared/ingredient.model';
import { Recipe } from './../recipe.model';
import { Component, OnInit,  OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {

  recipe: Recipe;
  id: number;
  recipeSub: Subscription;

  constructor(private shoppingListService: ShoppingListService,
              private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    );

    this.recipeSub = this.recipeService.recipesUpdated.subscribe((recipes: Recipe[]) => {
      this.recipe = recipes[this.id];
    });
  }

  toShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate([''], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.recipeSub.unsubscribe();
  }
}
