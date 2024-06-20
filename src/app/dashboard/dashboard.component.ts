import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {


  constructor(private router:Router){}


  poultry(){
    this.router.navigate(["/product-list"])
  }

  products(){
    this.router.navigate(["/product-list"])
  }

}
