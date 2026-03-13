import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  createUser(data: User) {
    return this.http.post(this.api, data);
  }

  updateUser(id: number, user: User) {
    return this.http.put<User>(`${this.api}/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.api}/${id}`, {
      responseType: 'text'
    });
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/roles');
  }
}
