import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
    selector: 'app-edit-customer',
    templateUrl: './edit-customer.component.html',
    styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
    customer: any = {
        id: null,
        name: '',
        email: '',
        phone: '',
        image: ''
    };

    constructor(private customerService: CustomerService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id'); 
        if (idParam) {
            const id = +idParam; 
            this.customerService.getCustomerById(id).subscribe(data => {
                this.customer = data;
            }, error => {
            
                console.error('Error fetching customer:', error);
                this.router.navigate(['/customers']); 
            });
        } else {
            console.error('No customer ID found in route parameters');
            this.router.navigate(['/customers']);
        }
    }

    onSubmit() {
        this.customerService.updateCustomer(this.customer.id, this.customer).subscribe(() => {
            this.router.navigate(['/customers']); 
        });
    }
}
