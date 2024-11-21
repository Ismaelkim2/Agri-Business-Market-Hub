import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EggsRecordService } from '../services/eggsRecord.service';
import { NotificationService } from '../services/notification.service';

export interface EggRecord {
  id: number;
  date: Date | string;
  eggsCount: number;
}

@Component({
  selector: 'app-eggs-record-list',
  templateUrl: './eggs-record-list.component.html',
  styleUrls: ['./eggs-record-list.component.css'],
})
export class EggsRecordListComponent implements OnInit {
  eggRecords: EggRecord[] = [];
  pagedRecords: EggRecord[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;

  errorMessage: string | null = null;
  notificationMessage: string | null = null;
  showSpinner: boolean = true;
  showTick: boolean = false;



  chartData: any[] = [];
  chartLabels: string[] = [];
  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#A10A28', '#AAAAAA'],
  };

  isSmallScreen: boolean = false;

  isEditing: boolean = false;
  currentRecord: EggRecord | null = null;

  constructor(
    private router: Router,
    private eggsRecordService: EggsRecordService,
    private notificationService: NotificationService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isSmallScreen = window.innerWidth < 768;
  }

  ngOnInit(): void {
    this.isSmallScreen = window.innerWidth < 768;
    this.fetchRecords();
  }

  fetchRecords(): void {
    this.eggsRecordService.getRecords().subscribe(
      (data: EggRecord[]) => {
        this.eggRecords = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.updatePagedRecords();
        this.updateChart();
      },
      (error) => console.error('Error fetching records:', error)
    );
  }

  get totalEggs(): number {
    return this.eggRecords.reduce((total, record) => total + record.eggsCount, 0);
  }

  updatePagedRecords(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedRecords = this.eggRecords.slice(startIndex, startIndex + this.itemsPerPage);
  }

  updateChart(): void {
    this.chartData = [
      {
        name: 'Eggs',
        series: this.eggRecords.map((record) => ({
          name: new Date(record.date).toLocaleDateString(),
          value: record.eggsCount,
        })),
      },
    ];
  }

  navigateToAddRecord(): void {
    this.router.navigate(['/eggs-record-form']);
  }

  openEditModal(record: EggRecord): void {
    this.currentRecord = { ...record };  
    this.isEditing = true;
  }


  closeEditModal(): void {
    this.isEditing = false;
    this.currentRecord = null;
  }

  updateRecord(): void {
    if (this.currentRecord) {
      console.log('Updating record:', this.currentRecord);
  
      this.eggsRecordService.updateRecord(this.currentRecord.id, this.currentRecord).subscribe(
        (response) => {
          const index = this.eggRecords.findIndex((record) => record.id === this.currentRecord?.id);
          if (index !== -1) {
            this.eggRecords[index] = this.currentRecord!;
            this.updatePagedRecords();
            this.updateChart();
          }
          this.closeEditModal();
          this.notificationService.showNotification('Record updated successfully', false, true);
        },
        (error) => {
          console.error('Error updating record:', error);
          this.notificationService.showNotification('Failed to update record.', false, false);
        }
      );
    } else {
      console.error('No current record to update.');
    }
  }
  
  
  deleteRecord(id: number): void {
    this.eggsRecordService.deleteRecord(id).subscribe(
      (response) => {
        console.log('Success:', response);
        if (response.message) {
          this.showNotification(response.message, true);  
          this.eggRecords = this.eggRecords.filter((record) => record.id !== id);
          this.updatePagedRecords();
          this.updateChart();
        } else if (response.error) {
          this.showNotification(response.error, false);  
        }
      },
      (error) => {
        console.error('Error deleting record:', error);
        this.showNotification('Failed to delete record.', false);
      }
    );
  }
  
  
  showNotification(message: string, success: boolean = true): void {
    this.notificationMessage = message;
    this.showSpinner = success;
    this.showTick = !success;
    setTimeout(() => {
      this.notificationMessage = null;
    }, 4000);
  }
  

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePagedRecords();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.eggRecords.length / this.itemsPerPage);
  }
}
