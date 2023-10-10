import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getCategories();
  }

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getCategories(): void {
    this.categoryService.getCategories().subscribe((data: any) => {
      console.log('respuesta categorias: ', data);
      this.processCategoriesResponse(data);
    }),
      (error: any) => {
        console.log('error categorias: ', error);
      };
  }

  processCategoriesResponse(resp: any) {
    const dataCategory: CategoryElement[] = [];

    if (resp.metadata[0].code == '00') {
      let listCategory = resp.categoryResponse.category;

      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);

      this.dataSource.paginator = this.paginator;
    }
  }

  openCategoryDialog() {

    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.snackBar.open('Se ha creado la categoría', 'Exito',{
          duration: 1000,
        });
        this.getCategories();
      } else if (result == 2) {
        this.snackBar.open('No se ha creado la categoría', 'Error', {
          duration: 1000,
        });
      }
    });
  }

  edit(id:number, name:string, description:string){

    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '500px',
      data: {id: id, name: name, description: description},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.snackBar.open('Se ha actualizado la categoria', 'Exito',{
          duration: 1000,
        });
        this.getCategories();
      } else if (result == 2) {
        this.snackBar.open('No se ha actualizado', 'Error', {
          duration: 1000,
        });
      }
    });

  }
}

export interface CategoryElement {
  id: number;
  name: string;
  description: string;
}
