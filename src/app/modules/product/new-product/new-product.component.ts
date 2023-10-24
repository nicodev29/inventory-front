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
      price: this.productForm.get('price')?.value,
      quantity: this.productForm.get('quantity')?.value,
      category: this.productForm.get('category')?.value,
      image: this.selectedFile
    }

    const uploadImageData = new FormData();
    uploadImageData.append('file',data.image, data.image.name);
    uploadImageData.append('name', data.name);
    uploadImageData.append('price', data.price);
    uploadImageData.append('quantity', data.quantity);
    uploadImageData.append('categoryID', data.category);

    if (this.data != null) {

      //update the product
      this.productService.updateProduct(uploadImageData, this.data.id)
      .subscribe ({
        next: (data : any) => {
          console.log("respuesta producto: ", data)
          this.dialogRef.close(1);
        },
        error: (error:any) => {
          this.dialogRef.close(2);
        }
      });


    } else {

      //save the product
      this.productService.saveProduct(uploadImageData)
      .subscribe ({
        next: (data : any) => {
          console.log("respuesta producto: ", data)
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
      this.productForm = this.fb.group({
        name: [data.name, Validators.required],
        price: [data.price, Validators.required],
        quantity: [data.quantity, Validators.required],
        category: [data.category.id, Validators.required],
        image: ["", Validators.required]
    });
  }


    onFileChange(event : any){
      this.selectedFile = event.target.files[0];
      this.nameImg = this.selectedFile.name;  // Aquí asignamos el nombre del archivo a la variable nameImg
      this.productForm.get('image')?.setValue(this.selectedFile);  // Aquí cambiamos 'file' por 'image' para que coincida con el formControlName en tu HTML
      console.log("imagen: ", this.selectedFile);
  }
  
}
  

