import { Injectable } from '@angular/core';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Farm Products', description: 'Agri-business Consultations', imageUrl: 'assets/images/maizeMain.png', price: 500 },
    { id: 2, name: 'Packed & Dried Maize', description: 'Wholesale', imageUrl: 'assets/images/maize1.png', price: 25000 },
    { id: 3, name: 'Brown-Maize', description: 'Dried', imageUrl: 'assets/images/maize2.png', price: 5500 },
    { id: 4, name: '90kg Maize', description: '1 sack', imageUrl: 'assets/images/maize3.png', price: 5500 },
    { id: 5, name: '2-90kg Maize', description: '2 sacks', imageUrl: 'assets/images/maize4.png', price: 10500 },
    { id: 6, name: 'Dried Maize Grains', description: 'Well Preserved', imageUrl: 'assets/images/maize5.png', price: 10 },
    { id: 7, name: '1 Acre Immature Maize', description: 'We sell immature maize in the farm', imageUrl: 'assets/images/maize6.png', price: 80000 },
    { id: 8, name: 'Wholesale Roast Maize', description: 'For Roasting, Processing or manufacturing purposes', imageUrl: 'assets/images/maize7.png', price: 200 },
    { id: 9, name: 'Roast Maize', description: 'Pieces of maize to be roasted', imageUrl: 'assets/images/maize8.png', price: 200 },
    { id: 10, name: 'Dried Maize', description: 'Dried in the farm-Sun Drying', imageUrl: 'assets/images/maize9.png', price: 2000 },
  
  ];

  getProducts(): Product[] {
    return this.products;
  }
}
