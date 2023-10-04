import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{

  private categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories () : void {
    this.categoryService.getCategories()
    .subscribe( (data : any) => {

      console.log("respuesta categorias: ", data);

    }),
    (error : any) => { 
        console.log("error categorias: ", error);
      }
  }
}
