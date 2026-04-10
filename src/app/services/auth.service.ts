import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, { email, password });
  }


  logout(): void {
    localStorage.clear();
  }

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.roles?.[0] || null;
  }

  getUsername(): string {
    const decoded = this.getDecodedToken();
    return decoded?.username || decoded?.sub || 'User';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ROLE_ADMIN';
  }

  isManager(): boolean {
    return this.getRole() === 'ROLE_MANAGER';
  }

  isCustomer(): boolean {
    return this.getRole() === 'ROLE_CUSTOMER';
  }
}
