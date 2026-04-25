import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ManagerDashboard} from '../models/manager-dashboard.model';

@Injectable({ providedIn: 'root' })
export class ManagerDashboardService {

  private readonly baseUrl = 'http://localhost:8080/api/manager/dashboard';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<ManagerDashboard> {
    return this.http.get<ManagerDashboard>(this.baseUrl);
  }
}
