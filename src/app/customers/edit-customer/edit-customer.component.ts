import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  selectedImage: File | null = null;

  customer: any = {
    id: null,
    name: '',
    email: '',
    phone: '',
    image: ''
  };

  constructor(private customerService: CustomerService, private route: ActivatedRoute, private router: Router) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      this.customer.image = URL.createObjectURL(file);
    }
  }

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
    const formData = new FormData(); 
    formData.append('name', this.customer.name);
    formData.append('email', this.customer.email);
    formData.append('phone', this.customer.phone);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage); 
    }

    this.customerService.updateCustomer(this.customer.id, formData).subscribe(() => {
      this.router.navigate(['/customers']); 
    }, error => {
      console.error('Error updating customer:', error);
    });
  }
}
