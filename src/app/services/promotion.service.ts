import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion } from '../models/promotion.model';
import {PromotionRequest} from '../models/promotion.model';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private apiUrl = 'http://localhost:8080/api/promotions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl);
  }

  getById(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/${id}`);
  }

  create(data: PromotionRequest): Observable<Promotion> {
    return this.http.post<Promotion>(this.apiUrl, data);
  }

  update(id: number, data: PromotionRequest): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }

  search(
    code?: string,
    startDate?: string,
    endDate?: string,
    status?: string
  ): Observable<Promotion[]> {

    let params: any = {};

    if (code) params.code = code;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (status !== undefined && status !== null && status !== '') {
      params.status = status;
    }

    return this.http.get<Promotion[]>(`${this.apiUrl}/search`, {
      params
    });
  }
}
