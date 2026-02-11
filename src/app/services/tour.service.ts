import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Tour } from "../models/tour.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class TourService {
    private api = 'http://localhost:8080/api/tours';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Tour[]> {
        return this.http.get<Tour[]>(this.api);
    }

    getById(id: number): Observable<Tour> {
        return this.http.get<Tour>(`${this.api}/${id}`);
    }
}