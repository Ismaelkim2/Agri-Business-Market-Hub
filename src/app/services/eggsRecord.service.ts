import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

interface ResponseMessage {
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EggsRecordService {
  private baseUrl = `${environment.apiUrl}/api/eggs`;

  constructor(private http: HttpClient) {}


  getRecords(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addRecord(record: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, record);
  }
  

  updateRecord(id: number, record: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, record);
  }

  deleteRecord(id: number): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(`${this.baseUrl}/${id}`);
  }
}
