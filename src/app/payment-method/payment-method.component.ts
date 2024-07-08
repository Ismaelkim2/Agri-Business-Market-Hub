import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent {
  selectedPaymentMethod: string = '';
  mpesaDetails = { phoneNumber: '' };
  payPalDetails = { email: '' };
  cashOnDeliveryDetails = { address: '' };

  constructor(private router: Router, private cartService: CartService) {}

  onSubmit() {
    this.cartService.setPaymentMethod(this.selectedPaymentMethod);
    this.router.navigate(['/delivery-form']);
  }

  onMpesasubmit() {
    this.cartService.setDeliveryInfo(this.mpesaDetails);
    this.router.navigate(['/delivery-form']);
  }

  onPayPalSubmit() {
    this.cartService.setDeliveryInfo(this.payPalDetails);
    this.router.navigate(['/delivery-form']);
  }

  onCashOnDeliverySubmit() {
    this.cartService.setDeliveryInfo(this.cashOnDeliveryDetails);
    this.router.navigate(['/delivery-form']);
  }
}
