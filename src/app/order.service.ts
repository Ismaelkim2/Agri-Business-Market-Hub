import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private lastOrderNumber: number = 1000; 

  constructor() {}

  generateOrderNumber(): number {
    this.lastOrderNumber += 1;
    return this.lastOrderNumber;
  }
}
