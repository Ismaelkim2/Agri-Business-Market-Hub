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
        image: null // Initialize as null
    };

    constructor(private customerService: CustomerService, private router: Router) {}

    onFileChange(event: any) {
        const file = event.target.files[0]; // Get the file from the input
        if (file) {
            this.customer.image = file; // Store the file in the customer object
        }
    }

    onSubmit() {
        const formData = new FormData(); // Create a FormData object
        formData.append('name', this.customer.name);
        formData.append('email', this.customer.email);
        formData.append('phone', this.customer.phone);
        formData.append('image', this.customer.image); // Append the image file

        this.customerService.createCustomer(formData).subscribe(() => {
            this.router.navigate(['/customers']); 
        });
    }
}
