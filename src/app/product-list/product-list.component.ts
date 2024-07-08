import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product-service.service';
import { CartService } from '../cart.service';
import { Product } from '../models/product.model';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  notification: string | null = null;
  private cartUpdateSubscription!: Subscription; 

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef 
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
