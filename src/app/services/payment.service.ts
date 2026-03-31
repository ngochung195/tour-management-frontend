  import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentResponse {
  status: string;
  message: string;
  url: string;
  bookingId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private api = 'http://localhost:8080/api/payment';

  constructor(private http: HttpClient) {}

  createPayment(bookingId: number, bankCode: string = 'NCB'): Observable<PaymentResponse> {
    const params = new HttpParams()
      .set('bookingId', bookingId)
      .set('bankCode', bankCode);
    return this.http.get<PaymentResponse>(`${this.api}/create_payment`, { params });
  }
}
