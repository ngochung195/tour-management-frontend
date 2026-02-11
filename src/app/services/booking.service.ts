import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../models/booking.model';
import { BookingRequest } from '../models/booking-request.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private api = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) { }

  bookTour(data: BookingRequest) {
    return this.http.post(this.api, data);
  }

  getMyBookings() {
    return this.http.get<Booking[]>(`${this.api}/my`);
  }
}
