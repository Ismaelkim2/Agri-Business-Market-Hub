import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product-service.service';
import { CartService } from '../cart.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-poultry-list',
  templateUrl: './poultry-list.component.html',
  styleUrls: ['./poultry-list.component.css']
})
export class PoultryListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  quickView(product: Product): void {
    alert(`Quick view of ${product.name}`);
  }
}
