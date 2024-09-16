import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  private cartUpdatedSubject: Subject<string> = new Subject<string>();
  private paymentMethod: string = '';
  private deliveryInfo: any = {};
  private userDeliveryInfo: any = {}; 

  getCart(): Observable<Product[]> {
    return this.cartSubject.asObservable();
  }

  getCartUpdated(): Observable<string> {
    return this.cartUpdatedSubject.asObservable();
  }

  addToCart(product: Product): void {
    const currentCart = this.cartSubject.value;
    this.cartSubject.next([...currentCart, product]);
    this.cartUpdatedSubject.next(`${product.name} added to cart`);
  }

  removeFromCart(index: number): void {
    const currentCart = this.cartSubject.value;
    const removedProduct = currentCart[index];
    currentCart.splice(index, 1);
    this.cartSubject.next([...currentCart]);
    this.cartUpdatedSubject.next(`${removedProduct.name} removed from cart`); 
  }

  setPaymentMethod(paymentMethod: string): void {
    this.paymentMethod = paymentMethod;
  }

  getPaymentMethod(): string {
    return this.paymentMethod;
  }

  setDeliveryInfo(deliveryInfo: any): void {
    this.deliveryInfo = deliveryInfo;
  }

  getDeliveryInfo(): any {
    return this.deliveryInfo;
  }

  setUserDeliveryInfo(userInfo: any): void {
    this.userDeliveryInfo = userInfo;
  }

  getUserDeliveryInfo(): any {
    return this.userDeliveryInfo;
  }
}
