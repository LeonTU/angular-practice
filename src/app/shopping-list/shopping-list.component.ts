import { Subscription } from 'rxjs';
import { ShoppingListService } from './shopping-list.service';
import { Ingredient } from '../shared/ingredient.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  
  ingredients: Ingredient[];
  ingredientsSub: Subscription;

  constructor(private shoppingListService: ShoppingListService) { }
  
  ngOnDestroy(): void {
    this.ingredientsSub.unsubscribe();
  }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientsSub = this.shoppingListService.ingredientsUpdated.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients; 
      }
    );
  }

  onItemSelectedToEdit(index: number): void {
    this.shoppingListService.enterEditMode(index);
  }
}
