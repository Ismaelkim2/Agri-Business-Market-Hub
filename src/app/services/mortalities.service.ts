import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Mortality {
  id: number;
  date: Date;
  numberOfMortalities: number;
  reason: string;
  recordedBy: string;
  visible?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class MortalitiesService {
  private apiUrl = 'http://localhost:8081/api/mortalities';

  constructor(private http: HttpClient) {}

  getMortalities(): Observable<Mortality[]> {
    return this.http.get<Mortality[]>(this.apiUrl);
  }

  addMortality(mortality: Mortality): Observable<Mortality> {
    return this.http.post<Mortality>(this.apiUrl, mortality);
  }

  updateMortality(id: number, mortality: Mortality): Observable<Mortality> {
    return this.http.put<Mortality>(`${this.apiUrl}/${id}`, mortality);
  }

  deleteMortality(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
