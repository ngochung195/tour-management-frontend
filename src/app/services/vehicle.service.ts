import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Vehicle } from "../models/vehicle.model";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private api = 'http://localhost:8080/api/vehicles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.api);
  }

  getById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.api}/${id}`);
  }

  searchVehicle(keyword?: string) {
    let params: any = {};
    if (keyword) params.keyword = keyword;

    return this.http.get<Vehicle[]>(`${this.api}/search`, { params });
  }

  createVehicle(data: Vehicle) {
    return this.http.post(this.api, data);
  }

  updateVehicle(id: number, data: Vehicle) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteVehicle(id: number) {
    return this.http.delete(`${this.api}/${id}`, {
      responseType: 'text'
    });
  }
}
