import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product-service.service';
import { CartService } from '../cart.service';
import { Product } from '../models/product.model';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Locale } from 'date-fns';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  notification: string | null = null;
  private cartUpdateSubscription!: Subscription; 
  isSidebarOpen = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef ,
    private location:Location
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
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

  goBack(): void {
    this.location.back();
  } 

  ngOnDestroy(): void {
    if (this.cartUpdateSubscription) {
      this.cartUpdateSubscription.unsubscribe();
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  quickView(product: Product): void {
    alert(`Quick view of ${product.name}
      ${product.imageUrl}
      ${product.description}
    `);
  }
}
