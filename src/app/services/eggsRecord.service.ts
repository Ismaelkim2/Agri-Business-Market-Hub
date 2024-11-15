import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';


export interface EggsRecord {
  id: number;
  date: string; 
  eggCount: number;
  broken: number;
  recordedBy: string;
 
}

@Injectable({
  providedIn: 'root'
})
export class EggsRecordService {
  private apiUrl = `${environment.apiUrl}/api/eggs`;

  constructor(private http: HttpClient) {
    this.getRecords()
  }

  getRecords(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/records`);
  }

  getRecordById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/records/${id}`);
  }

  createRecord(record: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/records`, record);
  }

  updateRecord(record: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/records/${record.id}`, record);
  }

  deleteRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/records/${id}`);
  }
}
