import { UserDTO } from './../models/user.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CartService } from '../cart.service';
import { DataServiceService } from '../data-service.service';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment.prod';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  cart: Product[] = [];
  notification: string | null = null;
  cartSubscription: Subscription = new Subscription();
  cartUpdatedSubscription: Subscription = new Subscription();
  isLoggedInSubscription: Subscription = new Subscription();
  loggedInUserSubscription: Subscription = new Subscription();
  isLoggedIn: boolean = false;
  userFirstName: string | null = null;
  userImageUrl: string = '';
  loggedInUser: UserDTO | null | undefined;
  environment=environment;
  isSidebarOpen = false;

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
        this.loggedInUserSubscription = this.dataService.loggedInUser.subscribe((user: UserDTO | null) => {
          console.log("User Details:", user); 
          this.userFirstName = user ? user.firstName : null;
          this.userImageUrl = user ? user.userImageUrl : '';
          
            // Log the image URL to ensure it's correct
        if (user && user.userImageUrl) {
          console.log("User Image URL:", this.environment.apiUrl + '/' + user.userImageUrl.replace('\\', '/'));
        }

        });
      } else {
        this.userFirstName = null;
      }
    });
  
    this.dataService.loggedInUser.subscribe((user: UserDTO | null) => {
      this.loggedInUser = user;
    });
  }
  

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.cartUpdatedSubscription.unsubscribe();
    this.isLoggedInSubscription.unsubscribe();
    this.loggedInUserSubscription.unsubscribe();
  }

  navigateTo(route: string): void {
    this.dataService.isLoggedIn.pipe(take(1)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate([route]);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }


  removeFromCart(index: number): void {
    this.cartService.removeFromCart(index);
  }

  submitOrder(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/delivery-form']);
    } else {
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
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

}
