
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import { RegistrationComponent } from './registration/registration.component';
import { PoultryListComponent } from './poultry-list/poultry-list.component';
import { DeliveryFormComponent } from './delivery-form/delivery-form.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { PostListComponent } from './post-list/post-list.component';
import { NewPostComponent } from './new-post/new-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { OurServicesComponent } from './our-services/our-services.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { FaqComponent } from './faq/faq.component';
import { TimeAgoPipe } from './time-ago.pipe';
import { SummaryComponent } from './summary/summary.component';
import { RecordsComponent } from './records/records.component';
import { FarmDataComponent } from './farm-data/farm-data.component';


import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card'; 
import { ProductService } from './product-service.service';
import { DataServiceService } from './data-service.service';
import { CartService } from './cart.service';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { WorkersComponent } from './workers/workers.component';
import { WorkersFormComponent } from './workers-form/workers-form.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SettingsComponent } from './settings/settings.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { SalesComponent } from './sales/sales.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { AddCustomerComponent } from './customers/add-customer/add-customer.component';
import { EditCustomerComponent } from './customers/edit-customer/edit-customer.component';
import { MortalitiesComponent } from './mortalities/mortalities.component';
import { EditMortalityComponent } from './mortalities/edit-mortality/edit-mortality.component';
import { ToastrModule } from 'ngx-toastr';
import { EggsRecordFormComponent } from './eggs-record-list/eggs-record-form/eggs-record-form.component';
import { EggsRecordListComponent } from './eggs-record-list/eggs-record-list.component';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
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
    SummaryComponent,
    FaqComponent,
    TimeAgoPipe,
    RecordsComponent,
    FarmDataComponent,
    WorkersComponent,
    WorkersFormComponent,
    SidebarComponent,
    SettingsComponent,
    ExpensesComponent,
    SalesComponent,
    CustomersComponent,
    AddCustomerComponent,
    EditCustomerComponent,
    MortalitiesComponent,
    EditMortalityComponent,
    EggsRecordFormComponent,
    EggsRecordListComponent
  
    
    

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule ,
    NgbModule,
    ToastrModule.forRoot(),
  
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
   
  ],
 

  providers: [
    provideClientHydration(),
    ProductService,
    DataServiceService,
    CartService,
    provideHttpClient(), 
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
