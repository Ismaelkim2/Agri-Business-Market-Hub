import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { DataServiceService } from '../data-service.service';
import { Subscription } from 'rxjs';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-delivery-form',
  templateUrl: './delivery-form.component.html',
  styleUrls: ['./delivery-form.component.css']
})
export class DeliveryFormComponent implements OnInit, OnDestroy {
cart:Product[]=[]
total:number=0;

  deliveryInfo = {
    name: '',
    address: '',
    phone: '',
    email: ''
  };

  private userSubscription!: Subscription;

  constructor(
    private router: Router,
    private cartService: CartService,
    private dataServiceService: DataServiceService
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
      this.calculateTotal();
    });


    this.userSubscription = this.dataServiceService.loggedInUser.subscribe(user => {
      if (user) {
        this.deliveryInfo = {
          name: `${user.firstName} ${user.lastName}`,
          phone: user.phoneNumber,
          address: this.deliveryInfo.address, 
          email: user.email
        };
        // console.log('retrieved info:',this.deliveryInfo)

       
        const savedDeliveryInfo = this.cartService.getDeliveryInfo();
        if (savedDeliveryInfo) {
          this.deliveryInfo = { ...this.deliveryInfo, ...savedDeliveryInfo };
        }
      }
    });


    const savedDeliveryInfo = this.cartService.getDeliveryInfo();
    if (savedDeliveryInfo) {
      this.deliveryInfo = { ...this.deliveryInfo, ...savedDeliveryInfo };
    }
  }

  onSubmit() {
    this.cartService.setDeliveryInfo(this.deliveryInfo);
    this.router.navigate(['/payment-method']);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  calculateTotal(): void {
    this.total = this.cart.reduce((total, product) => total + product.price, 0);
  }
}
