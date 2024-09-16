import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserDTO } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private apiUrl = 'http://localhost:8081/api';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private loggedInUserSubject = new BehaviorSubject<any>(null);
  private userRoleSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) { }

  signIn(credentials: { phoneNumber: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/user/login`, credentials)
      .pipe(
        map(response => {
          if (response && response.token) {
            this.isLoggedInSubject.next(true);
            localStorage.setItem('token', response.token);  
            return true;
          } else {
            return false;
          }
        }),
        tap(loggedIn => {
          if (loggedIn) {
            this.fetchUserDetails(credentials.phoneNumber).subscribe(user => {
              this.loggedInUserSubject.next(user);
              this.userRoleSubject.next(user.role);
            });
          }
        })
      );
  }

  fetchUserDetails(phoneNumber: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('user:password')
    });
    return this.http.get<any>(`${this.apiUrl}/user/details`, { params: { phoneNumber }, headers });
  }
  
  
  signOut(): void {
    this.isLoggedInSubject.next(false);
    this.loggedInUserSubject.next(null);
    this.userRoleSubject.next(null);
    localStorage.removeItem('token');
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  get loggedInUser(): Observable<any> {
    return this.loggedInUserSubject.asObservable();
  }

  get userRole(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  getUserById(userId: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/user/${userId}`);
  }
}
