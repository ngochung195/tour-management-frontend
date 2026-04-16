import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TourDetail } from "../models/tour-detail.model";

@Injectable({
  providedIn: 'root'
})
export class TourDetailService {

  private api = 'http://localhost:8080/api/tour-details';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>(this.api);
  }

  getById(id: number): Observable<TourDetail> {
    return this.http.get<TourDetail>(`${this.api}/${id}`);
  }

  getByTour(tourId: number): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>(`${this.api}/tour/${tourId}`);
  }

  getByHotel(hotelId: number): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>(`${this.api}/hotel/${hotelId}`);
  }

  getByVehicle(vehicleId: number): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>(`${this.api}/vehicle/${vehicleId}`);
  }

  create(data: any) {
    return this.http.post(this.api, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`, {
      responseType: 'text'
    });
  }
}
