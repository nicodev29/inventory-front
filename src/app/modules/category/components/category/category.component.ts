import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{

  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getCategories();
  }

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();


  getCategories () : void {
    this.categoryService.getCategories()
    .subscribe( (data : any) => {

      console.log("respuesta categorias: ", data);
      this.processCategoriesResponse(data);

    }),
    (error : any) => { 
        console.log("error categorias: ", error);
      }

  }

  processCategoriesResponse (resp: any){

    const dataCategory: CategoryElement[] = [];

    if (resp.metadata[0].code == "00"){

      let listCategory = resp.categoryResponse.category;

      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);

    }
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent , {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result =>{

    });

  }

}

export interface CategoryElement {
  id: number;
  name: string;
  description: string;
}
