import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {

  constructor(private http: HttpClient) {}

  sendMessage(message: string, history: {role: string, parts: {text: string}[]}[]) {
    const token = localStorage.getItem('token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return this.http.post(
      'http://localhost:8080/api/chat',
      { message, history },
      { responseType: 'text', headers }
    );
  }
}
