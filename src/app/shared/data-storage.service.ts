import { Recipe } from './../recipes/recipe.model';
import { RecipeService } from './../recipes/recipe.service';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(`https://my-angular-practice-1811d.firebaseio.com/recipes.json`, recipes)
      .subscribe();
  }

  restoreRecipes() {
    this.http
      .get<Recipe[]>(`https://my-angular-practice-1811d.firebaseio.com/recipes.json`)
      .subscribe((data: Recipe[]) => {
        this.recipeService.setRecipes(data);
      });
  }
}
