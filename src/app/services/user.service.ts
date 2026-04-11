import { Injectable } from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
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

  searchUsers(name?: string, role?: string): Observable<User[]>{
    let params: any = {};

    if (name){
      params.name = name;
    }

    if (role){
      params.role = role;
    }

    return this.http.get<User[]>(`${this.api}/search-user`, {params});
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

  forgotPassword(email: string) {
    return this.http.post(
      `${this.api}/forgot-password?email=${email}`,
      {}
    );
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(
      `${this.api}/reset-password?token=${token}&newPassword=${newPassword}`,
      {}
    );
  }

  getProfile(){
    return this.http.get<User>(`${this.api}/me`);
  }

  updateProfile(user: User) {
    return this.http.put<User>(`${this.api}/me`, user);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/roles');
  }
}
