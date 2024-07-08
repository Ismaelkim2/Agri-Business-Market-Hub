import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
// import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import { ProductService } from './product-service.service';
import { RegistrationComponent } from './registration/registration.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { PoultryListComponent } from './poultry-list/poultry-list.component';
import { DeliveryFormComponent } from './delivery-form/delivery-form.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { DataServiceService } from './data-service.service';
import { CartService } from './cart.service';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { PostListComponent } from './post-list/post-list.component';
import { NewPostComponent } from './new-post/new-post.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditPostComponent } from './edit-post/edit-post.component';
import { OurServicesComponent } from './our-services/our-services.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { FaqComponent } from './faq/faq.component';
import { TimeAgoPipe } from './time-ago.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // SidebarComponent,
    HeaderComponent,
    HomeComponent,
    DashboardComponent,
    ProductListComponent,
    CartComponent,
    RegistrationComponent,
    PoultryListComponent,
    DeliveryFormComponent,
    PaymentMethodComponent,
    OrderConfirmationComponent,
    ContactComponent,
    FooterComponent,
    PostListComponent,
    NewPostComponent,
    EditPostComponent,
    OurServicesComponent,
    AboutUsComponent,
    FaqComponent,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  providers: [
    provideClientHydration(),
    ProductService,
    DataServiceService,
    CartService,
    provideHttpClient(), // Keeping the default configuration
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
