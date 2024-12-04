import { Component, EventEmitter, Output } from '@angular/core';
import { Worker, WorkersService } from '../services/workers.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-workers-form',
  templateUrl: './workers-form.component.html',
  styleUrls: ['./workers-form.component.css']
})
export class WorkersFormComponent {
  @Output() workerAdded = new EventEmitter<Worker>();
  worker: Worker = { id: 0, name: '', role: '', salary: 0, status: '', image: '', email: '', phone: '' };
  selectedImageFile: File | null = null;
  isFormVisible: boolean = true;  
  successMessage: string | null = null;  

  constructor(private workersService: WorkersService, private location: Location) {}

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  saveWorker() {
    if (this.selectedImageFile) {
      this.workersService.saveWorker(this.worker, this.selectedImageFile).subscribe(
        (savedWorker) => {
          this.workerAdded.emit(savedWorker); 
          this.showSuccessMessage(); 
          this.toggleForm(); 
        },
        (error) => {
          console.error('Error saving worker:', error);
        }
      );
    } else {
      console.error('No image file selected for the worker.');
    }
  }

  toggleForm() {
    this.isFormVisible = false; 
  }

  showSuccessMessage() {
    this.successMessage = "Worker successfully added!";
    setTimeout(() => {
      this.successMessage = null;  
    }, 3000);  
  }

  goBack() {
    this.location.back();
  }
}
