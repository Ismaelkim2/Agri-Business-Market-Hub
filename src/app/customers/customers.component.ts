import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router'; 

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
    customers: any[] = [];
    displayedColumns: string[] = ['id', 'image', 'name', 'email', 'phone', 'action'];

    constructor(private customerService: CustomerService, private router: Router) {} 

    ngOnInit() {
        this.loadCustomers();
    }

    loadCustomers() {
        this.customerService.getCustomers().subscribe(data => {
            this.customers = data;
            this.customers.forEach(customer => {
                console.log("Image URL:", `http://localhost:8081/${customer.image}`);
            });
        });
    }
    
    

    addCustomer() {
        this.router.navigate(['/add-customer']); 
    }

    editCustomer(id: number) {
        this.router.navigate(['/edit-customer', id]); 
    }

    deleteCustomer(id: number) {
        this.customerService.deleteCustomer(id).subscribe(() => {
            this.loadCustomers();
        });
    }

    viewCustomer(id: number) {
        this.router.navigate(['/view-customer', id]); // Navigate to ViewCustomerComponent
    }
}
