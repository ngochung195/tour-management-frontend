import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  private api = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  getByMonth(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/revenues/month`);
  }

  getByQuarter(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/revenues/quarter`);
  }
}
