import { Subscription } from 'rxjs';
import { RecipeService } from './../recipe.service';
import { Recipe } from '../recipe.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  sub: Subscription;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
    this.sub = this.recipeService.recipesUpdated.subscribe(
      (recipes: Recipe[]) => this.recipes = recipes
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
