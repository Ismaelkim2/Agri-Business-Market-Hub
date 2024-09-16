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
  loggedInUserSubscription: Subscription = new Subscription();
  isLoggedIn: boolean = false;
  userFirstName: string | null = null;

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
      }, 3000); 
    });

    this.isLoggedInSubscription = this.dataService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.loggedInUserSubscription = this.dataService.loggedInUser.subscribe((user: any) => {
          console.log("User Details:", user);
          this.userFirstName = user ? user.firstName : null;
        });
      } else {
        this.userFirstName = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.cartUpdatedSubscription.unsubscribe();
    this.isLoggedInSubscription.unsubscribe();
    this.loggedInUserSubscription.unsubscribe();
  }

  removeFromCart(index: number): void {
    this.cartService.removeFromCart(index);
  }

  submitOrder(): void {
    if(this.isLoggedIn){
this.router.navigate(['/delivery-form'])
    }else{
      this.router.navigate(['/login']);
    }
    
  }

  SignIn(): void {
    this.router.navigate(['/login']);
  }

  SignUp(): void {
    this.router.navigate(['/registration']);
  }


  SignOut(): void {
    this.dataService.signOut();
    this.router.navigate(['/dashboard']);
  }
}
