import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly baseUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) { }

  bookTour(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my`);
  }

  cancelBooking(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/cancel`, {});
  }
}
