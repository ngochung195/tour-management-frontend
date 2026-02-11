import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerBookingService {
  private api = 'http://localhost:8080/api/manager/bookings'

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  updateStatus(id: number, status: String): Observable<any> {
    return this.http.put(`http://localhost:8080/api/bookings/${id}/status?status=${status}`, {});
  }
}
