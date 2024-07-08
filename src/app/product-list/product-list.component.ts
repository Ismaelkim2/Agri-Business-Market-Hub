<<<<<<< HEAD
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product-service.service';
import { CartService } from '../cart.service';
import { Product } from '../models/product.model';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
=======
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product-service.service';
import { CartService } from '../cart.service';
import { Product } from '../models/product.model';
>>>>>>> origin/master

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
<<<<<<< HEAD
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  notification: string | null = null;
  private cartUpdateSubscription!: Subscription; 

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef 
=======
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  notification: string | null = null; // Add notification property

  constructor(
    private productService: ProductService,
    private cartService: CartService
>>>>>>> origin/master
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
<<<<<<< HEAD
    this.cartUpdateSubscription = this.cartService.getCartUpdated().subscribe(
      message => {
        this.notification = message;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.notification = null;
          this.cdr.detectChanges();
        }, 3000);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.cartUpdateSubscription) {
      this.cartUpdateSubscription.unsubscribe();
    }
=======
>>>>>>> origin/master
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
<<<<<<< HEAD
=======
    this.notification = `Added ${product.name} to cart`; // Set notification message
    setTimeout(() => this.notification = null, 3000); // Clear notification after 3 seconds
>>>>>>> origin/master
  }

  quickView(product: Product): void {
    alert(`Quick view of ${product.name}
      ${product.imageUrl}
      ${product.description}
<<<<<<< HEAD
    `);
=======
      
      `
                        
    );
>>>>>>> origin/master
  }
}
