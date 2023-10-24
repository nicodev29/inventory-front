import { Component, inject } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent {

  private productService = inject (ProductService);
  public dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

}
