import { Injectable } from '@angular/core';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Farm Products', quantity:2, description: 'BrishKimEcoEggs Vedio Clip', imageUrl: 'assets/images/mediumpoultry.mp4', price: 1200,status:'pending', mediaType: 'video' },
    { id: 2, name: 'To be transported',quantity:2, description: 'Wholesale', imageUrl: 'assets/images/maize1.png', price: 25000, status:'pending'},
    { id: 4, name: '5kg chickens', quantity:2,description: '1 cock', imageUrl: 'assets/images/maize3.ng', price: 5500,status:'pending' },
    { id: 5, name: '2 sasso cocks', quantity:2,description: '2 cocks', imageUrl: 'assets/images/maize4.ng', price: 2500 ,status:'pending'},
    { id: 6, name: 'cockerel',quantity:2, description: 'Well Preserved', imageUrl: 'assets/images/maize5.ng', price: 10 ,status:'pending'},
    { id: 7, name: 'Laying birds',quantity:2, description: 'We sell laying hens in the farm', imageUrl: 'assets/images/maize6.png', price: 80000,status:'pending' },
    { id: 8, name: 'Wholesale ',quantity:2, description: 'For Roasting, Processing or manufacturing purposes', imageUrl: 'assets/images/maize7.ng', price: 200,status:'pending' },
    { id: 9, name: 'Pellets', quantity:2,description: 'No of chicks to be sold', imageUrl: 'assets/images/maize8.ng', price: 20000 ,status:'pending'},
    { id: 10, name: 'Old flock',quantity:2, description: 'Mature', imageUrl: 'assets/images/maize9.ng', price: 2000,status:'pending' },
  
  ];

  getProducts(): Product[] {
    return this.products;
  }
}
