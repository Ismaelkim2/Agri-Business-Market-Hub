import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  selectedPaymentMethod: string = '';
  mpesaDetails = { phoneNumber: '' };
  payPalDetails = { email: '' };
  cashOnDeliveryDetails = { address: '' };

  constructor(
    private router: Router,
    private cartService: CartService,
    private dataServiceService: DataServiceService
  ) {}

  ngOnInit(): void {
  }

  onSubmit() {
    
    this.cartService.setPaymentMethod(this.selectedPaymentMethod);

    this.dataServiceService.loggedInUser.subscribe(user => {
      if (user) {
        const deliveryInfo = {
          name: `${user.firstName} ${user.lastName}`,
          phone: user.phoneNumber,
          address: '', 
          email: user.email
        };
        this.cartService.setDeliveryInfo(deliveryInfo);
      }

      this.router.navigate(['/order-confirmation']);
    });
  }

  onMpesasubmit() {
    this.cartService.setPaymentMethod('M-pesa');
    this.cartService.setDeliveryInfo(this.mpesaDetails);
    this.router.navigate(['/order-confirmation']);
  }

  onPayPalSubmit() {
    this.cartService.setPaymentMethod('PayPal');
    this.cartService.setDeliveryInfo(this.payPalDetails);
    this.router.navigate(['/order-confirmation']);
  }

  onCashOnDeliverySubmit() {
    this.cartService.setPaymentMethod('Cash on Delivery');
    this.cartService.setDeliveryInfo(this.cashOnDeliveryDetails);
    this.router.navigate(['/order-confirmation']);
  }
}
