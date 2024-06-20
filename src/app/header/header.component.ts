import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../cart.service';
import { DataServiceService } from '../data-service.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cart: Product[] = [];
  notification: string | null = null;
  cartSubscription: Subscription = new Subscription();
  cartUpdatedSubscription: Subscription = new Subscription();
  isLoggedInSubscription: Subscription = new Subscription();
  userPhoneNumberSubscription: Subscription = new Subscription();
  isLoggedIn: boolean = false;
  userPhoneNumber: string | null = null;

  constructor(
    private dataService: DataServiceService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCart().subscribe((cart: Product[]) => {
      this.cart = cart;
    });

    this.cartUpdatedSubscription = this.cartService.getCartUpdated().subscribe((message: string) => {
      this.notification = message;
      setTimeout(() => {
        this.notification = null;
      }, 3000); // Notification disappears after 3 seconds
    });

    this.isLoggedInSubscription = this.dataService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.userPhoneNumberSubscription = this.dataService.loggedInUser.subscribe((user: any) => {
      this.userPhoneNumber = user ? user.phoneNumber : null;
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.cartUpdatedSubscription.unsubscribe();
    this.isLoggedInSubscription.unsubscribe();
    this.userPhoneNumberSubscription.unsubscribe();
  }

  removeFromCart(index: number): void {
    this.cartService.removeFromCart(index);
  }

  submitOrder(): void {
    this.router.navigate(['/login']);
  }

  SignIn(): void {
    this.router.navigate(['/login']);
  }

  SignOut(): void {
    this.dataService.signOut();
    this.router.navigate(['/dashboard']);
  }
}
