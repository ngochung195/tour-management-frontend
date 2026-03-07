import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerBookingService {
  private api = 'http://localhost:8080/api/manager/bookings'

  constructor(private http: HttpClient) { }

  getAll(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.api);
  }

  updateStatus(id: number, status: String): Observable<any> {
    return this.http.put(`http://localhost:8080/api/manager/bookings/${id}/status?status=${status}`, {});
  }
}
