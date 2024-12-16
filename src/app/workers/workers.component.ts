import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Worker, WorkersService } from '../services/workers.service';
import { environment } from '../../environments/environment.prod';



@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css']
})
export class WorkersComponent implements OnInit {
  workers: Worker[] = [];
  editableWorker: Worker = {
    id: 0,
    image: '',
    name: '',
    role: '',
    salary: 0,
    email: '',
    phone: '',
    status: '',
  };
  isEditFormVisible: boolean = false;
  saveSuccess: boolean = false;
  selectedImageFile: File | null = null;
  baseUrl: string = environment.apiUrl; 

  @ViewChild('contentToCopy', { static: false }) contentToCopy!: ElementRef;

  constructor(private workersService: WorkersService, private location: Location) {}

  ngOnInit() {
    this.loadWorkers();
  }

  isValidImage(imageUrl: string | null): boolean {
    return typeof imageUrl === 'string' && imageUrl.length > 0;
  }
  
  imageError(event: any): void {
    const iconElement = document.createElement('i');
    iconElement.classList.add('fa', 'fa-user', 'worker-image');
    event.target.replaceWith(iconElement);
  }
  
  loadWorkers() {
    this.workersService.loadWorkers();
    this.workersService.workers$.subscribe((workers: Worker[]) => {
      this.workers = workers;
    });
  }

  goBack() {
    this.location.back();
  }

  onWorkerAdded(newWorker: Worker) {
    if (this.selectedImageFile) {
      this.workersService.saveWorker(newWorker, this.selectedImageFile).subscribe(() => {
        this.displaySaveMessage();
        this.selectedImageFile = null;
        this.loadWorkers(); // Refresh worker list
      });
    }
  }

  onEditWorker(worker: Worker) {
    this.editableWorker = { ...worker };
    this.isEditFormVisible = true;
  }

  onSaveWorkerChanges() {
    if (this.editableWorker && this.editableWorker.id) {
      this.workersService.updateWorker(
        this.editableWorker,
        this.editableWorker.id,
        this.selectedImageFile ?? undefined
      ).subscribe(() => {
        this.isEditFormVisible = false;
        this.displaySaveMessage();
        this.loadWorkers(); // Refresh worker list
        this.selectedImageFile = null;
      });
    }
  }

  onDeleteWorker(workerId: number) {
    if (confirm('Are you sure you want to delete this worker?')) {
      this.workersService.deleteWorker(workerId).subscribe(() => {
        this.loadWorkers(); 
      });
    }
  }

  onImageFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.selectedImageFile = target.files[0];
    }
  }

  copyToClipboard(): void {
    const contentText = this.contentToCopy.nativeElement.innerText;
    navigator.clipboard.writeText(contentText).then(() => {
      alert("Content copied to clipboard!");
    }).catch((err) => {
      console.error("Could not copy content: ", err);
    });
  }

  shareContent(): void {
    const contentText = this.contentToCopy.nativeElement.innerText;
    if (navigator.share) {
      navigator.share({
        title: 'Share Worker Information',
        text: contentText,
        url: window.location.href
      }).then(() => {
        console.log("Content shared successfully!");
      }).catch((error) => {
        console.error("Error sharing content: ", error);
      });
    } else {
      alert("Sharing is not supported in this browser.");
    }
  }

  onPrint(): void {
    window.print();
  }

  private displaySaveMessage() {
    this.saveSuccess = true;
    setTimeout(() => (this.saveSuccess = false), 5000);
  }
}
