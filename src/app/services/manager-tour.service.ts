import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerTourService {
  private api = 'http://localhost:8080/api/manager/tours'

  constructor(private http: HttpClient) { }

  getAllTours(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getTourById(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.api}/${id}`);
  }

  createTour(data: any) {
    return this.http.post(this.api, data);
  }

  updateTour(id: number, tour: any) {
    return this.http.put(`${this.api}/${id}`, tour);
  }

  deleteTour(id: number) {
    return this.http.delete(`${this.api}/${id}`, {
      responseType: 'text'
    });
  }

  getCategories() {
    return this.http.get<any[]>('http://localhost:8080/api/categories');
  }
}
