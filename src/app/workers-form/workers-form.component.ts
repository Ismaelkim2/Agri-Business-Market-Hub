import { Component, EventEmitter, Output } from '@angular/core';
import { Worker, WorkersService } from '../services/workers.service';

@Component({
  selector: 'app-workers-form',
  templateUrl: './workers-form.component.html',
})
export class WorkersFormComponent {
  @Output() workerAdded = new EventEmitter<Worker>();
  worker: Worker = { id: 0, name: '', role: '', salary: 0, status: '', image: '', email: '', phone: '' };
  selectedImageFile: File | null = null;

  constructor(private workersService: WorkersService) {}

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  saveWorker(): void {
    console.log('Worker to be saved:', this.worker);
 
    if (this.selectedImageFile) {
      this.workersService.saveWorker(this.worker, this.selectedImageFile).subscribe(
        (savedWorker) => {
          this.workerAdded.emit(savedWorker);
        },
        (error) => {
          console.error('Error saving worker:', error);
        }
      );
    } else {
      console.error('No image file selected for the worker.');
    }
  }
  
}
