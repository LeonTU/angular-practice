import { Ingredient } from './../../shared/ingredient.model';
import { Recipe } from './../recipe.model';
import { RecipeService } from './../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, AbstractControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  editMode: boolean = false;
  id: number;
  recipeForm: FormGroup;
  private recipe: Recipe;
  private ingredientFormGroups: FormGroup[];
  get ingredients(): AbstractControl[] {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }
  get imagePathPreview(): string {
    return this.recipeForm.get('imagePath').value;
  }

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.editMode = !!params['id'];
        if (this.editMode) {
          this.id = +params['id'];
          this.recipe = this.recipeService.getRecipe(this.id);
        }
        this.initForm(this.editMode);
      }
    );
  }

  private initForm(editMode: boolean) {
    if (editMode) {
      this.recipeForm = new FormGroup({
        name: new FormControl(this.recipe.name, Validators.required),
        description: new FormControl(this.recipe.description, Validators.required),
        imagePath: new FormControl(this.recipe.imagePath, Validators.required),
        ingredients: new FormArray(this.getIngredientFormGroups()),
        newIngredient: new FormGroup({
          name: new FormControl(),
          amount: new FormControl()
        })
      });
    } else {
      this.recipeForm = new FormGroup({
        name: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
        imagePath: new FormControl(null, Validators.required),
        ingredients: new FormArray([]),
        newIngredient: new FormGroup({
          name: new FormControl(),
          amount: new FormControl()
        })
      });
    }
  }

  private getIngredientFormGroups(): FormGroup[] {
    this.ingredientFormGroups = [];

    if (this.recipe.ingredients.length > 0) {
      this.recipe.ingredients.forEach(ingredient => {
        this.ingredientFormGroups.push(new FormGroup({
          name: new FormControl(ingredient.name, Validators.required),
          amount: new FormControl(ingredient.amount, [
            Validators.required,
            Validators.pattern(/^[1-9]+[0-9]*$/)
          ])
        }));
      });
    }

    return this.ingredientFormGroups;
  }

  onSave() {
    if (this.editMode)
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    else
      this.recipeService.addRecipe(this.recipeForm.value);
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onReset() {
    this.initForm(this.editMode);
  }

  onAddIngredient() {
    const newGroupValue = this.recipeForm.get('newIngredient').value;
    const newGroupControl: FormGroup = new FormGroup({
      name: new FormControl(newGroupValue.name, Validators.required),
      amount: new FormControl(newGroupValue.amount, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
    });
    (this.recipeForm.get('ingredients') as FormArray).push(newGroupControl);
    this.recipeForm.get('newIngredient').reset();
  }

  onRemoveIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }
}
