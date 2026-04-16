import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Hotel } from "../models/hotel.model";

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private api = 'http://localhost:8080/api/hotels';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.api);
  }

  getById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.api}/${id}`);
  }

  createHotel(data: Hotel) {
    return this.http.post(this.api, data);
  }

  updateHotel(id: number, data: Hotel) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteHotel(id: number) {
    return this.http.delete(`${this.api}/${id}`, {
      responseType: 'text'
    });
  }
}
