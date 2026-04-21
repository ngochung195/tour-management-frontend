import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Tour } from "../models/tour.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class TourService {
    private api = 'http://localhost:8080/api/tours';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Tour[]> {
        return this.http.get<Tour[]>(this.api);
    }

    getById(id: number): Observable<Tour> {
        return this.http.get<Tour>(`${this.api}/${id}`);
    }

    searchTour(keyword?: string, startDate?: string, endDate?: string, categoryId?: number){
      let params: any = {};

      if (keyword) params.keyword = keyword;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (categoryId !== undefined && categoryId !== null)
        params.categoryId = categoryId;

      return this.http.get<Tour[]>(`${this.api}/search-tour`, {params});
    }


    createTour(data: Tour | FormData) {
        return this.http.post(this.api, data);
    }

    updateTour(id: number, tour: Tour | FormData) {
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

    getItineraryByTourId(id: number) {
      return this.http.get<any[]>(`http://localhost:8080/api/itineraries/tour/${id}`);
    }
}
