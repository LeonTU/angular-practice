import { Subscription } from 'rxjs';
import { ShoppingListService } from './../shopping-list.service';
import { Ingredient } from './../../shared/ingredient.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') form: NgForm;
  editMode: boolean;
  editModeSub: Subscription;
  ingredient: Ingredient;
  index: number;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.editModeSub = this.shoppingListService.editMode.subscribe((index: number) => {
      if (index >= 0) {
        this.index = index;
        this.editMode = true;
        this.ingredient = this.shoppingListService.getIngredient(index);
        this.form.setValue({
          'name': this.ingredient.name,
          'amount': this.ingredient.amount
        });
      } else {
        //this.onClear();
      }
    });
  }

  onAddorSave(form: NgForm) {
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.index, form.value);
      //this.shoppingListService.leaveEditMode();
    } else {
      const ingredients: Ingredient[] = [new Ingredient(form.value.name, form.value.amount)];
      this.shoppingListService.addIngredients(ingredients); 
    }
    this.onClear();
  }

  onDelete(): void {
    if (this.editMode) {
      this.shoppingListService.deleteIngredient(this.index);
      this.onClear();  
    }
  }

  onClear(): void {
    this.editMode = false;
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.editModeSub.unsubscribe();
  }
}
