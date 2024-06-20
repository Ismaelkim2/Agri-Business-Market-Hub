import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  confettis: { duration: number; delay: number; left: number; size: number; }[] = Array(100).fill(0).map(() => ({
    duration: Math.random(),
    delay: Math.random(),
    left: Math.random(),
    size: Math.random()
  }));

  estimatedDeliveryDate: string='';
  orderNumber!: number;

  constructor(private cartService: CartService, private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.setEstimatedDeliveryDate();
    this.orderNumber = this.orderService.generateOrderNumber();

    // Set a timeout to navigate to the product list after 3 seconds
    setTimeout(() => {
      this.router.navigate(['/product-list']);
    }, 15000);
  }

  setEstimatedDeliveryDate(): void {
    const orderDate = new Date();
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 3);
    this.estimatedDeliveryDate = deliveryDate.toDateString();
  }
}
