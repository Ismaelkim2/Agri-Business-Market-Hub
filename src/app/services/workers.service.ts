import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Worker {
  id: number;
  name: string;
  role: string;
  salary: number;
  status: string;
  image: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkersService {
  private workersSubject = new BehaviorSubject<Worker[]>([]);
  workers$ = this.workersSubject.asObservable();
  private apiUrl = 'http://localhost:8081/api/workers';

  constructor(private http: HttpClient) {
    this.loadWorkers();
  }

  loadWorkers(): void {
    this.http.get<Worker[]>(this.apiUrl).subscribe(workers => {
      this.workersSubject.next(workers);
    });
  }

  saveWorker(worker: Worker, imageFile: File): Observable<Worker> {
    const formData = new FormData();
    formData.append('name', worker.name);
    formData.append('role', worker.role);
    formData.append('salary', worker.salary.toString());
    formData.append('status', worker.status);
    formData.append('email', worker.email);  
    formData.append('phone', worker.phone);  
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.post<Worker>(this.apiUrl, formData);
  }

  updateWorker(worker: Worker, id: number, imageFile?: File): Observable<Worker> {
    const formData = new FormData();
    formData.append('name', worker.name);
    formData.append('role', worker.role);
    formData.append('salary', worker.salary.toString());
    formData.append('status', worker.status);
    formData.append('email', worker.email);  
    formData.append('phone', worker.phone);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.put<Worker>(`${this.apiUrl}/${id}`, formData);
  }

  deleteWorker(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
