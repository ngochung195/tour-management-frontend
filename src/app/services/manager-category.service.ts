import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model.';

@Injectable({
  providedIn: 'root'
})
export class ManagerCategoryService {

  private api = 'http://localhost:8080/api/manager/categories'

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.api}/${id}`);
  }

  createCategory(data: any) {
    return this.http.post(this.api, data);
  }

  updateCategory(id: number, category: any) {
    return this.http.put(`${this.api}/${id}`, category);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.api}/${id}`, {
      responseType: 'text'
    });
  }
}
