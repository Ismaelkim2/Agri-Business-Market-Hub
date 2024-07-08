import { ServiceService } from './../service.service';
import { Component, OnInit } from '@angular/core';
import { Service } from '../models/service.model';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.css']
})
export class OurServicesComponent implements OnInit {
  services: Service[];
  selectedService: Service | undefined;

  constructor(private ServiceService:ServiceService) {
    this.services = this.ServiceService.getAllServices();
  }

  ngOnInit(): void { }

  openModal(service: Service): void {
    this.selectedService = service;
    const modalElement = document.getElementById('serviceModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
}
