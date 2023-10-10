import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent {
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  constructor() {}

  ngOninit(): void {}

  onNoClick() {
    this.dialogRef.close();
  }

  delete() {
    if (this.data != null) {
      this.categoryService.deleteCategory(this.data.id).subscribe({
        next: (data: any) => {
          console.log('respuesta categorias: ', data);
          this.dialogRef.close(1);
        },
        error: (error: any) => {
          this.dialogRef.close(2);
        },
      });
    }
  }
}
