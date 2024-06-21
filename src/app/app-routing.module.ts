import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import { RegistrationComponent } from './registration/registration.component';
import { PoultryListComponent } from './poultry-list/poultry-list.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { DeliveryFormComponent } from './delivery-form/delivery-form.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { PostListComponent } from './post-list/post-list.component';
import { NewPostComponent } from './new-post/new-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { OurServicesComponent } from './our-services/our-services.component';
import { AboutUsComponent } from './about-us/about-us.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'product-list',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'poultry-list', component: PoultryListComponent },
  { path: 'payment-method', component: PaymentMethodComponent },
  { path: 'delivery-form', component: DeliveryFormComponent },
  { path: 'order-confirmation', component: OrderConfirmationComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'post-list', component: PostListComponent },
  { path: 'new-post', component: NewPostComponent },
  { path: 'edit-post/:id', component: EditPostComponent },
  {path: 'our-services',component:OurServicesComponent},
  {path:'about-us',component:AboutUsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
