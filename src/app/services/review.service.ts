import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReviewService {

  api = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  private auth() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  create(req: any) {
    return this.http.post(this.api, req, this.auth());
  }

  getByTour(tourId: number) {
    return this.http.get(`${this.api}/tour/${tourId}`);
  }

  update(id: number, req: any) {
    return this.http.put(`${this.api}/${id}`, req, this.auth());
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`, this.auth());
  }
}
