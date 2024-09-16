import { Component, OnInit } from '@angular/core';
import { OrderService } from './../order.service';
import { DataServiceService } from './../data-service.service';
import { CartService } from '../cart.service';
import { Order, Product } from '../models/product.model';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  orders: Order[] = [];
  loggedInUser: any;
  cart: Product[] = [];
  total: number = 0;

  constructor(
    private orderService: OrderService,
    private dataService: DataServiceService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.fetchLoggedInUser();
  }

  fetchLoggedInUser(): void {
    this.dataService.loggedInUser.subscribe(
      (user) => {
        this.loggedInUser = user;
        console.log('Logged In User:', this.loggedInUser);
        if (this.loggedInUser) {
          this.fetchCart(); 
        }
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  fetchCart(): void {
    this.cartService.getCart().subscribe(
      (cart: Product[]) => {
        this.cart = cart;
        console.log('Fetched cart:', this.cart);
        this.calculateTotal();  // Calculate total after fetching cart items
      },
      (error) => {
        console.error('Error fetching cart:', error);
      }
    );
  }

  calculateTotal(): void {
    this.total = this.cart.reduce((total, product) => total + product.price * product.quantity, 0);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  }
}
