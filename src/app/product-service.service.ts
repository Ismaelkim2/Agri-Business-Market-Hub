import { Injectable } from '@angular/core';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Farm Products', quantity:2, description: 'Agri-business Consultations', imageUrl: 'assets/images/maizeMain.png', price: 500,status:'pending' },
    { id: 2, name: 'Packed & Dried Maize',quantity:2, description: 'Wholesale', imageUrl: 'assets/images/maize1.png', price: 25000, status:'pending'},
    { id: 3, name: 'Brown-Maize', quantity:2,description: 'Dried', imageUrl: 'assets/images/maize2.png', price: 5500 ,status:'pending'},
    { id: 4, name: '90kg Maize', quantity:2,description: '1 sack', imageUrl: 'assets/images/maize3.png', price: 5500,status:'pending' },
    { id: 5, name: '2-90kg Maize', quantity:2,description: '2 sacks', imageUrl: 'assets/images/maize4.png', price: 10500 ,status:'pending'},
    { id: 6, name: 'Dried Maize Grains',quantity:2, description: 'Well Preserved', imageUrl: 'assets/images/maize5.png', price: 10 ,status:'pending'},
    { id: 7, name: '1 Acre Immature Maize',quantity:2, description: 'We sell immature maize in the farm', imageUrl: 'assets/images/maize6.png', price: 80000,status:'pending' },
    { id: 8, name: 'Wholesale Roast Maize',quantity:2, description: 'For Roasting, Processing or manufacturing purposes', imageUrl: 'assets/images/maize7.png', price: 200,status:'pending' },
    { id: 9, name: 'Roast Maize', quantity:2,description: 'Pieces of maize to be roasted', imageUrl: 'assets/images/maize8.png', price: 200 ,status:'pending'},
    { id: 10, name: 'Dried Maize',quantity:2, description: 'Dried in the farm-Sun Drying', imageUrl: 'assets/images/maize9.png', price: 2000,status:'pending' },
  
  ];

  getProducts(): Product[] {
    return this.products;
  }
}
