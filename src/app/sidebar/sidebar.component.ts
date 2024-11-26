import { UserDTO } from './../models/user.model';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CartService } from '../cart.service';
import { DataServiceService } from '../data-service.service';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment.prod';
import { RecordsService } from '../services/records.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  recentActivities: string[] = [];
  isVibrating = false;
  private vibrationInterval: any;

  cart: Product[] = [];
  notification: string | null = null;
  cartSubscription: Subscription = new Subscription();
  cartUpdatedSubscription: Subscription = new Subscription();
  isLoggedInSubscription: Subscription = new Subscription();
  loggedInUserSubscription: Subscription = new Subscription();
  isLoggedIn: boolean = false;
  userFirstName: string | null = null;
  userImageUrl?: string | null;
  loggedInUser: UserDTO | null | undefined;
  environment = environment;
  isSidebarOpen = false;
  imageError = false;
  isLargeScreen = window.innerWidth >= 992;

  constructor(
    private dataService: DataServiceService,
    private router: Router,
    private cartService: CartService,
    private recordsService: RecordsService
  ) {}

  ngOnInit(): void {
    this.recordsService.recentActivities$.subscribe(activities => {
      this.recentActivities = activities;
      this.startVibration(); 
    });

    this.isSidebarOpen = this.isLargeScreen;

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

    this.startVibrationInterval()
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.cartUpdatedSubscription.unsubscribe();
    this.isLoggedInSubscription.unsubscribe();
    this.loggedInUserSubscription.unsubscribe();
    clearInterval(this.vibrationInterval);
  }

  viewActivities(): void {
    this.router.navigateByUrl('/activities', {
      state: { recentActivities: this.recentActivities },
    });
  }

  closeNavbar() {
    const navbar = document.getElementById('navbarSupportedContent');
    if (navbar) {
      navbar.classList.remove('show'); 
    }
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isLargeScreen = window.innerWidth >= 992;
    this.isSidebarOpen = this.isLargeScreen; 
  }

  onImageError(event: Event): void {
    this.imageError = true;
    (event.target as HTMLImageElement).style.display = 'none'; 
  }

  startVibration() {
    this.isVibrating = true;
    setTimeout(() => {
      this.isVibrating = false;
    }, 15000); 
  }


  startVibrationInterval() {
    this.vibrationInterval = setInterval(() => {
      this.startVibration();
    }, 5 * 60 * 1000);
  }
}
