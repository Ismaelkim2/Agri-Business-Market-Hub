import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
    selector: 'app-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent {
    customer: any = {
        name: '',
        email: '',
        phone: '',
        image: null 
    };

    constructor(private customerService: CustomerService, private router: Router) {}

    onFileChange(event: any) {
        const file = event.target.files[0]; 
        if (file) {
            this.customer.image = file; 
        }
    }

    onSubmit() {
        const formData = new FormData(); 
        formData.append('name', this.customer.name);
        formData.append('email', this.customer.email);
        formData.append('phone', this.customer.phone);
        formData.append('image', this.customer.image);

        this.customerService.createCustomer(formData).subscribe(() => {
            this.router.navigate(['/customers']); 
        });
    }
}
