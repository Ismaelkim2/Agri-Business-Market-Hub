import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from './models/product.model';
import { randomFill } from 'node:crypto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private lastOrderNumber: number =1000; 
  private apiUrl = 'http://localhost:8081/api/orders';

  constructor(private http: HttpClient) {}

  generateOrderNumber(): number {
    this.lastOrderNumber +=1;
    return this.lastOrderNumber;
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
}
