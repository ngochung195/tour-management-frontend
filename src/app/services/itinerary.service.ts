import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Itinerary, ItineraryRequest} from '../models/itinerary.model';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {

  private api = 'http://localhost:8080/api/itineraries';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(this.api);
  }

  getByTour(tourId: number): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.api}/tour/${tourId}`);
  }

  searchItinerary(keyword?: string, tourId?: number): Observable<Itinerary[]> {
    let params: any = {};

    if (keyword) params.keyword = keyword;
    if (tourId) params.tourId = tourId;

    return this.http.get<Itinerary[]>(`${this.api}/search`, { params });
  }
  getById(id: number): Observable<Itinerary> {
    return this.http.get<Itinerary>(`${this.api}/${id}`);
  }

  createItinerary(data: ItineraryRequest[]): Observable<Itinerary[]> {
    return this.http.post<Itinerary[]>(this.api, data);
  }

  updateItinerary(tourId: number, data: ItineraryRequest[]) {
    return this.http.put(`${this.api}/tour/${tourId}`, data);
  }

  deleteItinerary(id: number) {
    return this.http.delete(`${this.api}/${id}`, { responseType: 'text' });
  }

  deleteByTour(tourId: number) {
    return this.http.delete(`${this.api}/tour/${tourId}`, {
      responseType: 'text'
    });
  }

  getTours() {
    return this.http.get<any[]>('http://localhost:8080/api/tours');
  }
}
