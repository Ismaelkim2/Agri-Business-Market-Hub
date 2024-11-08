import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { AuthResponse } from './login/login.component';
import { environment } from '../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private apiUrl = `${environment.apiUrl}/api`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkInitialLoginStatus());
  private loggedInUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    
  }

  private checkInitialLoginStatus(): boolean {
    const token = localStorage.getItem('authToken'); 
    return !!token; 
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
  }

  
  signIn(credentials: { phoneNumber: string, password: string }): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/user/login`, credentials).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token); 
          this.isLoggedInSubject.next(true);
          this.fetchUserDetails(credentials.phoneNumber).subscribe(user => {
            this.loggedInUserSubject.next(user);
          });
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }
  

  fetchUserDetails(phoneNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/details`, { params: { phoneNumber }, headers: this.getAuthHeaders() });
  }

  signOut(): void {
    console.log('Signing out');
    this.isLoggedInSubject.next(false);
    this.loggedInUserSubject.next(null);
    localStorage.removeItem('authToken'); 
  }
  

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  get loggedInUser(): Observable<any> {
    return this.loggedInUserSubject.asObservable();
  }
}
