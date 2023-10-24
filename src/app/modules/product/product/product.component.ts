import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { NewProductComponent } from '../new-product/new-product.component';
import { ConfirmComponent } from '../../shared/componentes/confirm/confirm.component';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

 
  private productService = inject (ProductService);
  public dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);


  ngOnInit(): void {
    this.getProducts();
  }


  displayedColumns: string[] = ['id', 'name', 'price', 'quantity' , 'category', 'image', 'actions'];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getProducts (){
    this.productService.getProducts()
      .subscribe({
        next: (data: any) => {
          console.log('respuesta productos: ', data);
          this.processProductResponse(data);
        },
        error: (error: any) => {
          console.log('error productos: ', error);
        }
      });
  }


  processProductResponse (resp:any){
    const dataProduct: ProductElement[] = [];

    if (resp && resp.metadata && resp.metadata[0] && resp.metadata[0].code == '00') {
      // Cambia resp.product.products a resp.productResponse.products o la ruta correcta
      let listProduct = resp.productResponse && resp.productResponse.products;

      if (listProduct) {
        listProduct.forEach((element: ProductElement) => {
          //element.category = element.category.name;
          element.image = element.image ? 'data:image/jpeg;base64,' + element.image : '';
          dataProduct.push(element);
        });

        this.dataSource = new MatTableDataSource<ProductElement>(dataProduct);
        this.dataSource.paginator = this.paginator;
      }
    }

  }

  openProductDialog(){
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result == 1) {
        this.openSnackBar('Se ha creado el Producto', 'Exito');
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar('No se ha creado el producto', 'Error',);
      }
    });

  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 1000,
    });
  }

  delete(id: number) {

    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {id: id, module: "product"},
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.snackBar.open('Se ha eliminado el producto', 'Exito',{
          duration: 1000,
        });
        this.getProducts();
      } else if (result == 2) {
        this.snackBar.open('No se ha eliminado el producto', 'Error', {
          duration: 1000,
        });
      }
    });
   
  }

  edit (id: number, name: string, price: number, quantity: number, category: any) {

    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '500px',
      data: {id: id, name: name, price: price, quantity: quantity, category: category},
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result == 1) {
        this.openSnackBar('Producto editado', 'Exito');
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar('No se logro editar el producto', 'Error',);
      }
    });
  }


}


export interface ProductElement {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: any;
  image: any;
}

