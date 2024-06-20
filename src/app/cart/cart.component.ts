import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../models/product.model';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Product[] = [];
  total: number = 0;
  cartSubscription: Subscription = new Subscription();

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
      this.calculateTotal();
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  calculateTotal(): void {
    this.total = this.cart.reduce((total, product) => total + product.price, 0);
  }

  removeFromCart(index: number): void {
    this.cartService.removeFromCart(index);
  }

  proceedToPayment(): void {
    this.router.navigate(['/login']);
  }
}
