import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


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
          element.category = element.category.name;
          element.image = element.image ? 'data:image/jpeg;base64,' + element.image : '';
          dataProduct.push(element);
        });

        this.dataSource = new MatTableDataSource<ProductElement>(dataProduct);
        this.dataSource.paginator = this.paginator;
      }
    }

  }

  delete (id: number) {
  }

  edit (id: number, name: string) {
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

