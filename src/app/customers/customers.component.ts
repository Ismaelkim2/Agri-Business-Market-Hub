import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
    customers: any[] = [];
    displayedColumns: string[] = ['id', 'image', 'name', 'email', 'phone', 'action'];
    baseUrl: string = environment.apiUrl;

    constructor(private customerService: CustomerService, private router: Router) {}

    ngOnInit() {
        this.loadCustomers();
    }

    isValidImage(imageUrl: string | null): boolean {
        return typeof imageUrl === 'string' && imageUrl.length > 0;
      }
      
      imageError(event: any): void {
        const iconElement = document.createElement('i'); 
        iconElement.classList.add('fa', 'fa-user', 'customer-image'); 
        event.target.replaceWith(iconElement);  
      }
      

    loadCustomers() {
        this.customerService.getCustomers().subscribe(data => {
            this.customers = data.map(customer => ({
                ...customer,
                image: `${this.baseUrl}/${customer.image.replace(/\\/g, '/')}` 
            }));
        });
    }

    get totalCustomers(){
        return this.customers.length;
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
        this.router.navigate(['/view-customer', id]); 
    }
}

