import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';

const base_url = 'http://localhost:8080/api/v1';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  
  constructor(private http: HttpClient) { }

  getProducts (){
    const endpoint = `${base_url}/products`;
    return this.http.get(endpoint);
  }

  saveProduct(body:any) {
    const endpoint = `${base_url}/products`;
    return this.http.post(endpoint, body);
  }

  updateProduct(data: { name: any; description: any; quantity: any; category: any; image: any; }, id: any) {
    const endpoint = `${base_url}/products/update/${id}`;
    return this.http.put(endpoint, data);
  }

}
