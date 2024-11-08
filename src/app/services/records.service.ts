import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

export interface BirdRecord {
  date: string;
  count: number;
  eggProduction: number;
  feedConsumption:  string;
  vaccineRecords: { vaccine: string; date: string }[];
  hatchDate: string;
  totalBirds?: number;
  newFlock: number;
  mortalities: number;
  hatchdata: string;
  birdType: string;
  birdCount: number;
  sold: boolean;
  sales: number;
  expenses: number;
  vaccinationType: string;
  dateAdministered: string;
  name: string;
  dosage: number;
  administeredBy: string;
  remarks?: string;
  type: string;
  id?: number;
  salesAmount: number
}

export interface WeeklySummary {
  week: string;
  vaccineRecords: number;
  totalBirds: number;
  newFlock: number;
  mortalities: number;
  sales: number;
  expenses: number;
  profit: number;
}

export interface DailyRecord {
  id?: number;
  date: Date;
  birdType: string;
  sales: number;
  eggProduction?: number;
  feedConsumption?: number;
  expenses?: number;
  vaccineRecords?: { vaccine: string; date: string }[];
  hatchDate?: string;
  totalBirds?: number;
  newFlock?: number;
  mortalities?: number;
  hatchdata?: string;
  birdCount?: number;
  sold: boolean;
  count: number;
  salesAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private birdRecordsSubject = new BehaviorSubject<BirdRecord[]>([]);
  birdRecords$ = this.birdRecordsSubject.asObservable();

  private dailyRecordsSubject = new BehaviorSubject<DailyRecord[]>([]);
  dailyRecords$ = this.dailyRecordsSubject.asObservable();

  private weeklySummarySubject = new BehaviorSubject<WeeklySummary[]>([]);
  weeklySummary$ = this.weeklySummarySubject.asObservable();

  private apiUrl = `${environment.apiUrl}/api/records`;

  constructor(private http: HttpClient) {
    this.fetchBirdRecords();
  }

  fetchBirdRecords(): void {
    this.http.get<BirdRecord[]>(`${this.apiUrl}/birds`)
      .pipe(catchError(this.handleError))
      .subscribe(records => {
        this.birdRecordsSubject.next(records);
      });
  }

  saveBirdRecord(record: BirdRecord): Observable<BirdRecord> {
    const currentRecords = this.birdRecordsSubject.getValue();
    const updatedRecords = [...currentRecords, record];
    this.birdRecordsSubject.next(updatedRecords);

    return this.http.post<BirdRecord>(`${this.apiUrl}/birds`, record).pipe(
      catchError(error => {
        this.birdRecordsSubject.next(currentRecords);
        return throwError(() => new Error('Failed to save bird record.'));
      })
    );
  }

  updateBirdRecord(record: BirdRecord): Observable<BirdRecord> {
    const currentRecords = this.birdRecordsSubject.getValue();
    const updatedRecords = currentRecords.map(r => (r.id === record.id ? record : r));
    this.birdRecordsSubject.next(updatedRecords);

    return this.http.put<BirdRecord>(`${this.apiUrl}/birds/${record.id}`, record).pipe(
      catchError(error => {
        this.birdRecordsSubject.next(currentRecords);
        return throwError(() => new Error('Failed to update bird record.'));
      })
    );
  }

  deleteBirdRecord(id: number): Observable<void> {
    const currentRecords = this.birdRecordsSubject.getValue();
    const updatedRecords = currentRecords.filter(record => record.id !== id);
    this.birdRecordsSubject.next(updatedRecords);

    return this.http.delete<void>(`${this.apiUrl}/birds/${id}`).pipe(
      catchError(error => {
        this.birdRecordsSubject.next(currentRecords);
        return throwError(() => new Error('Failed to delete bird record.'));
      })
    );
  }

  getTotalBirds(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/birds`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('An error occurred; please try again later.'));
  }
}
