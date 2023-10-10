import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = 'http://localhost:8080/api/v1';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  /**
   * 
   * @returns Get all categories
   */
  getCategories() {
    const endpoint = `${base_url}/categories`;
    return this.http.get(endpoint);
  }


  /**
   * 
   * @returns Save a category
   */
  saveCategory(body: any) {
    const endpoint = `${base_url}/categories/save`;
    return this.http.post(endpoint, body);
  }

  /**
   * 
   * @returns Update category
   */

  updateCategorie (body: any, id: any) {
    const endpoint = `${base_url}/categories/update/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * 
   * @returns Delete category
   */
  deleteCategory(id: any) {
    const endpoint = `${base_url}/categories/${id}`;
    return this.http.delete(endpoint);
  }

}
