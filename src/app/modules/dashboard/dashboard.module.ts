import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './pages/dashboard.component';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../shared/components/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '../shared/shared.module';
import { CategoryComponent } from '../category/components/category/category.component';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';



@NgModule({
  declarations: [	
  DashboardComponent,
  HomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    CategoryModule,
    ProductModule
  ]
})
export class DashboardModule { }
