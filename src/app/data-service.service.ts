import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private apiUrl = 'http://localhost:8080/api/user';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private loggedInUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  signIn(credentials: { phoneNumber: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          if (response && response.token) {
            this.isLoggedInSubject.next(true);
            return true;
          } else {
            return false;
          }
        }),
        tap(loggedIn => {
          if (loggedIn) {
            this.fetchUserDetails(credentials.phoneNumber).subscribe(user => {
              this.loggedInUserSubject.next(user);
            });
          }
        })
      );
  }

  private fetchUserDetails(phoneNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/details`, { params: { phoneNumber } });
  }

  signOut(): void {
    this.isLoggedInSubject.next(false);
    this.loggedInUserSubject.next(null);
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  get loggedInUser(): Observable<any> {
    return this.loggedInUserSubject.asObservable();
  }

}
