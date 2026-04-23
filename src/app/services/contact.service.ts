import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ContactService {

  private api = 'http://localhost:8080/api/contacts';

  constructor(private http: HttpClient) {}

  sendContact(data: any) {
    return this.http.post(this.api, data, { responseType: 'text' });
  }

  getAll() {
    return this.http.get<any[]>(this.api);
  }

  updateStatus(id: number, status: string) {
    return this.http.put(
      `${this.api}/${id}/status?status=${status}`,
      {},
      { responseType: 'text' }
    );
  }
}
