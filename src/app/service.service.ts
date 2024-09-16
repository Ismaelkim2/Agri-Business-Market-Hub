import { Injectable } from '@angular/core';
import { Service } from './models/service.model';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private services: Service[] = [
    new Service(1, 'Consulting', 'Expert advice for your agricultural needs.', 'Expert advice and solutions tailored for your agricultural needs. We help you maximize efficiency and productivity.', 'assets/images/consultingImage.jpg'),
    new Service(2, 'Market Analysis', 'In-depth market insights.', 'In-depth market insights to help you make informed decisions. Stay ahead of the competition with our comprehensive analysis.', 'assets/images/marketAnalysisImage.jpg'),
    new Service(3, 'Supply Chain Management', 'Efficient supply chain solutions.', 'Efficient and reliable supply chain solutions for your business. We ensure timely delivery and optimal resource management.', 'assets/images/supplyChainImage.png'),
    new Service(4, 'Product Sales', 'Platform to buy and sell products.', 'A platform to buy and sell agricultural products directly. Connect with buyers and sellers easily.', 'assets/images/productSales.png'),
    new Service(5, 'Delivery Services', 'Fast and secure delivery services.', 'Fast and secure delivery services for all your agricultural products. We guarantee timely and safe deliveries.', 'assets/images/deliveryService.png'),
    new Service(6, 'Support & Maintenance', 'Ongoing support and maintenance.', 'Ongoing support and maintenance for your farming equipment and software. We ensure your operations run smoothly.', 'assets/images/supportImage.png')
  ];

  constructor() { }

  getServiceById(id: number): Service | undefined {
    return this.services.find(service => service.id === id);
  }

  getAllServices(): Service[] {
    return this.services;
  }
  
}
