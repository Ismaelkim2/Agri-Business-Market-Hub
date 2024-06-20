import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product-service.service';
import { CartService } from '../cart.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  notification: string | null = null; // Add notification property

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.notification = `Added ${product.name} to cart`; // Set notification message
    setTimeout(() => this.notification = null, 3000); // Clear notification after 3 seconds
  }

  quickView(product: Product): void {
    alert(`Quick view of ${product.name}`);
  }
}
