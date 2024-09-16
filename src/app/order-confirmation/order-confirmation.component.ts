import { DataServiceService } from './../data-service.service';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { OrderService } from '../order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {

  isLoggedInSubscription: Subscription = new Subscription();
  loggedInUserSubscription: Subscription = new Subscription();
  isLoggedIn: boolean = false;
  userFirstName: string | null = null;

  confettis: { duration: number; delay: number; left: number; size: number; }[] = Array(100).fill(0).map(() => ({
    duration: Math.random(),
    delay: Math.random(),
    left: Math.random(),
    size: Math.random()
  }));

  estimatedDeliveryDate: string = '';
  orderNumber!: number;
  userName: string = ''; 

  constructor(private cartService: CartService,
     private router: Router, 
     private orderService: OrderService,
    private dataService:DataServiceService) {}

  ngOnInit(): void {
    this.setEstimatedDeliveryDate();
    this.orderNumber = this.orderService.generateOrderNumber();

    setTimeout(() => {
      this.router.navigate(['/product-list']);
    }, 15000);

    this.isLoggedInSubscription = this.dataService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.loggedInUserSubscription = this.dataService.loggedInUser.subscribe((user: any) => {
          this.userFirstName = user ? user.firstName : null;
        });
      } else {
        this.userFirstName = null;
      }
    });
  }

  setEstimatedDeliveryDate(): void {
    const orderDate = new Date();
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 3);
    this.estimatedDeliveryDate = deliveryDate.toDateString();
  }

  continueShopping(): void {
    this.router.navigate(['/product-list']);
  }
}
