import { DataServiceService } from './../data-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-delivery-form',
  templateUrl: './delivery-form.component.html',
  styleUrls: ['./delivery-form.component.css']
})
export class DeliveryFormComponent implements OnInit {
  loggedInUser: any = '';
  deliveryInfo = {
    name: '',
    address: '',
    phone: '',
    email: ''
  };

  constructor(private router: Router, private cartService: CartService, private dataServiceService: DataServiceService) {}

  ngOnInit(): void {
    this.loggedInUser = this.dataServiceService.loggedInUser;
    if (this.loggedInUser) {
      // Automatically populate delivery information with logged-in user details
      this.deliveryInfo.name = this.loggedInUser.firstName + ' ' + this.loggedInUser.lastName;
      this.deliveryInfo.address = '';
      this.deliveryInfo.phone = this.loggedInUser.phoneNumber;
      this.deliveryInfo.email = this.loggedInUser.email;
    }

    // Fetch delivery information from CartService
    const savedDeliveryInfo = this.cartService.getDeliveryInfo();
    if (savedDeliveryInfo) {
      // Overwrite with saved delivery information if available
      this.deliveryInfo = savedDeliveryInfo;
    }
  }

  onSubmit() {
    // Save delivery information to CartService
    this.cartService.setDeliveryInfo(this.deliveryInfo);
    // Logic to handle order confirmation and payment processing
    this.router.navigate(['/order-confirmation']);
  }
}
