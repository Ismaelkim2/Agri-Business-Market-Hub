import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private baseUrl = 'http://localhost:8081/api/customers'; 

    constructor(private http: HttpClient) {}

    getCustomers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}`);
    }

    createCustomer(customer: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}`, customer); 
    }

    getCustomerById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`); 
    }

    updateCustomer(id: number, customer: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}`, customer); 
    }

    deleteCustomer(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
