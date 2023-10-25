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

  getProducts() {
    console.log('Iniciando getProducts');  // Agregado para depuración
    this.productService.getProducts()
      .subscribe({
        next: (data: any) => {
          console.log('Respuesta de productos recibida:', data);  // Agregado para depuración
  
          // Verifica si la respuesta es válida y contiene productos
          if (data && data.productResponse && data.productResponse.products !== null) {
            this.processProductResponse(data);
          } else {
            console.log('No se encontraron productos');  // Manejo cuando no hay productos
            // Aquí puedes decidir qué hacer cuando no hay productos, por ejemplo, mostrar un mensaje al usuario
          }
        },
        error: (error: any) => {
          console.log('Error al obtener productos:', error);  // Agregado para depuración
          console.log('Código de estado HTTP:', error.status);  // Agregado para depuración
          console.log('Mensaje de error:', error.message);  // Agregado para depuración
          console.log('Detalles del error:', error.error);  // Agregado para depuración
  
          // Aquí puedes agregar más manejo de errores específicos basado en el código de estado o el mensaje de error
          if (error.status === 404) {
            // Manejo específico para el error 404
            // Mostrar un mensaje al usuario o tomar alguna otra acción
          } else {
            // Manejo general para otros errores
            // Mostrar un mensaje al usuario o tomar alguna otra acción
          }
        }
      });
  }
  
  
  


  processProductResponse(resp: any) {
    console.log('Iniciando processProductResponse con respuesta:', resp);  // Agregado para depuración
    const dataProduct: ProductElement[] = [];
  
    if (resp && resp.metadata && resp.metadata[0] && resp.metadata[0].code === '00') {
      console.log('Metadatos validados');  // Agregado para depuración
      let listProduct = resp.productResponse && resp.productResponse.products;
  
      if (listProduct) {
        console.log('Lista de productos recibida:', listProduct);  // Agregado para depuración
        listProduct.forEach((element: ProductElement) => {
          element.image = element.image ? 'data:image/jpeg;base64,' + element.image : '';
          dataProduct.push(element);
        });
  
        this.dataSource = new MatTableDataSource<ProductElement>(dataProduct);
        this.dataSource.paginator = this.paginator;
      } else {
        console.log('Lista de productos está vacía o indefinida');  // Agregado para depuración
      }
    } else {
      console.log('Metadatos no validados');  // Agregado para depuración
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

  getProductByName(termino: string) {

    if (termino.length === 0) {
      return this.getProducts();
    }

    this.productService.getProductByName(termino)
    .subscribe((data: any) => {
      console.log('respuesta producto: ', data);
      this.processProductResponse(data);
    }),
      (error: any) => {
        console.log('error producto: ', error);
      };
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

