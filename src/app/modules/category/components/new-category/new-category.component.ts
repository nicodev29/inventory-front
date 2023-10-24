import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {

  public categoryForm! : FormGroup;
  estadoForm : string = "";
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA)

  constructor() { }

  ngOnInit(): void {

    this.estadoForm = "Agregar nueva";
    console.log("data: ", this.data);

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    if(this.data != null){
      this.estadoForm = "Actualizar";
      this.updateForm(this.data);
    }

  }

  onSave() {
    let data = {
      name: this.categoryForm.get('name')?.value,
      description: this.categoryForm.get('description')?.value
    }
  
    const apiCall = this.data != null ? 
      this.categoryService.updateCategorie(data, this.data.id) : 
      this.categoryService.saveCategory(data);
  
    apiCall.subscribe({
      next: (data: any) => {
        console.log("respuesta categorias: ", data);
        this.dialogRef.close(1);
      },
      error: (error: any) => {
        console.log("Error: ", error);
        if (error.status == 400 && error.error.metadata.code == "01" && error.error.metadata.code == "00") {
          alert("Ya existe una categoría con este nombre.");
        }
        this.dialogRef.close(2);
      }
    });
  }

    onCancel(){
      this.dialogRef.close(3);
    }

    updateForm(data: any) {
      this.categoryForm = this.fb.group({
        name: [data.name, Validators.required],
        description: [data.description, Validators.required]
      });
    }
  }
