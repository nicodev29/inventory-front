import { Component, inject } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';

export interface Category {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent {

  public productForm! : FormGroup;
  estadoForm : string = "";
  private fb = inject(FormBuilder);

  private productService = inject(ProductService);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA)
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);
  categories: Category [] = [];
  public dialog = inject(MatDialog);

  selectedFile: any;
  nameImg: string = "";



  ngOnInit () : void {

    this.estadoForm = "Agregar nuevo";

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required]
    });

    if(this.data != null){
      this.estadoForm = "Actualizar";
      this.updateForm(this.data);
    }

    this.getCategories();

  }



  onSave (){

    
    let data = {
      name: this.productForm.get('name')?.value,
      description: this.productForm.get('price')?.value,
      quantity: this.productForm.get('quantity')?.value,
      category: this.productForm.get('category')?.value,
      image: this.productForm.get('image')?.value
    }

    if(this.data != null){

      this.categoryService.updateCategorie(data, this.data.id)
      .subscribe ({
        next: (data : any) => {
          console.log("respuesta categorias: ", data)
          this.dialogRef.close(1);
        },
        error: (error:any) => {
          this.dialogRef.close(2);
        }
      });

    }else{
    
      this.categoryService.saveCategory(data)
      .subscribe ({
        next: (data : any) => {
          console.log("respuesta categorias: ", data)
          this.dialogRef.close(1);
        },
        error: (error:any) => {
          this.dialogRef.close(2);
        }
      });
    }

  }

  getCategories(){
    this.categoryService.getCategories()
    .subscribe((data: any) => {
      this.categories = data.categoryResponse.category;
    }
  )}


  onCancel (){
    this.dialogRef.close(3);
  }

  updateForm(data: any) {
    throw new Error('Method not implemented.');
  }

  onFileChange(event : any){

    this.selectedFile = event.target.files[0];
    this.nameImg = event.target.files[0].name;
    this.productForm.get('image')?.setValue(this.nameImg);

  }


}
