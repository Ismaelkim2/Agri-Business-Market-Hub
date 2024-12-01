import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EggsRecordService, WeeklyEggRecord } from '../services/eggsRecord.service';
import { NotificationService } from '../services/notification.service';

export interface EggRecord {
  id: number ;
  date: Date | string;
  eggsCount: number;
  brokenEggsCount: number;
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
  dailyRecords: { [key: string]: EggRecord } = {};
  record: EggRecord | null = null;

  errorMessage: string | null = null;
  notificationMessage: string | null = null;
  showSpinner: boolean = true;
  showTick: boolean = false;

  currentWeekRecords: EggRecord[] = [];
  previousRecords: WeeklyEggRecord[] = [];

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

  isSummaryRow(record: EggRecord): boolean {
    return record.date instanceof Date && record.date.getDay() === 0; 
  }

  fetchRecords(): void {
    this.eggsRecordService.getRecords().subscribe(
      (data: any) => {
        console.log("Fetched Data:", data);
  
        if (Array.isArray(data)) {
          const today = new Date();
          // Set start and end of the week
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          startOfWeek.setHours(0, 0, 0, 0); // Start of the day (midnight)
  
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999); // End of the day
  
          console.log("Start of Week (normalized):", startOfWeek);
          console.log("End of Week (normalized):", endOfWeek);
  
          // Filter, parse, and sort records
          this.eggRecords = data
            .filter((record) => !record.archived) // Exclude archived records
            .map((record) => {
              console.log("Record before parsing:", record);
              const recordDate = new Date(record.date);
              console.log("Parsed Date for Record:", recordDate);
              return { ...record, date: recordDate }; // Ensure date is a valid Date object
            })
            .filter((record) => {
              const isInRange = record.date >= startOfWeek && record.date <= endOfWeek;
              console.log(`Record ${record.id} is in range:`, isInRange);
              return isInRange;
            })
            .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date descending
  
          console.log("Filtered and Sorted Records:", this.eggRecords);
  
          if (this.eggRecords.length === 0) {
            console.warn("No records found for the selected week.");
          } else {
            this.groupRecordsByDay(); // Group records by day if there are any
          }
        } else {
          console.warn("Data is not an array:", data);
          this.eggRecords = [];
        }
  
        this.updatePagedRecords(); // Update paginated records
        this.updateChart(); // Update the chart with new data
      },
      (error) => {
        console.error("Error fetching records:", error);
        this.eggRecords = []; // Reset records in case of an error
      }
    );
  }
  
  

  groupRecordsByDay(): void {
    const dailyRecords: { [key: string]: EggRecord } = {};
    this.pagedRecords.forEach((record) => {
      const recordDate = new Date(record.date).toLocaleDateString();
      if (!dailyRecords[recordDate]) {
        dailyRecords[recordDate] = { ...record };
      } else {
        dailyRecords[recordDate].eggsCount += record.eggsCount;
        dailyRecords[recordDate].brokenEggsCount += record.brokenEggsCount;
      }
    });
    this.dailyRecords = dailyRecords;
  }
  

  get totalEggs(): number {
    return this.eggRecords.reduce((total, record) => total + record.eggsCount, 0);
  }


  updateChart(): void {
    const sortedRecordsForChart = Array.isArray(this.eggRecords)
      ? [...this.eggRecords].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      : [];

    this.chartData = [
      {
        name: 'Eggs',
        series: sortedRecordsForChart.map((record) => ({
          name: new Date(record.date).toLocaleDateString(),
          value: record.eggsCount,
        })),
      },
    ];
  }

  loadPreviousRecords(): void {
    this.eggsRecordService.getPreviousWeeksData().subscribe((data) => {
      this.previousRecords = data;
      this.router.navigate(['/archieved-egg-records']);
    });
  }

  checkAndArchiveCurrentWeek(): void {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); 

    if (today > endOfWeek) {
      const currentWeekRecords = this.eggRecords.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startOfWeek && recordDate <= endOfWeek;
      });

      this.archiveCurrentWeekData(currentWeekRecords);
    }
  }

  archiveCurrentWeekData(currentWeekRecords: EggRecord[]): void {
    this.eggsRecordService.archiveCurrentWeekData(currentWeekRecords).subscribe(
      () => {
        this.eggRecords = this.eggRecords.filter(
          (record) => !currentWeekRecords.some((archived) => archived.id === record.id)
        );
        this.loadPreviousRecords();
        this.updatePagedRecords();
        this.updateChart();
      },
      (error) => {
        console.error('Error archiving current week data:', error);
      }
    );
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
    if (this.record && this.record.id !== null) { 
      const recordId = this.record.id;

      if (typeof recordId === 'number') {
        console.log('Updating record:', this.record);
  
        this.eggsRecordService.updateRecord(recordId, this.record).subscribe(
          (response) => {
            const index = this.eggRecords.findIndex((record) => record.id === this.record?.id);
            if (index !== -1 && this.record !== null) {
              this.eggRecords[index] = this.record;
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
        console.error('Invalid record ID');
      }
    } else {
      console.error('No current record to update or ID is null.');
    }
  }
  
  
  
  deleteRecord(record: any): void {
    if (record && record.id !== null) {
      this.eggsRecordService.deleteRecord(record.id).subscribe(
        (response) => {
          const index = this.eggRecords.findIndex(r => r.id === record.id);
          if (index !== -1) {
            this.eggRecords.splice(index, 1); 
            this.updatePagedRecords();        
            this.updateChart();           
          }
          this.notificationService.showNotification('Record deleted successfully', false, true);
        },
        (error) => {
          console.error('Error deleting record:', error);
          this.notificationService.showNotification('Failed to delete record.', false, false);
        }
      );
    } else {
      console.error('Invalid record or record ID is null.');
    }
  }
  
  showNotification(message: string, success: boolean = true): void {
    this.notificationMessage = message;
    this.showSpinner = success;
    this.showTick = !success;
    setTimeout(() => {
      this.notificationMessage = null;
    }, 4000);
  }

  updatePagedRecords(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedRecords = this.eggRecords.slice(startIndex, startIndex + this.itemsPerPage);
  }
  

  goToPage(page: number): void {
    if (page < 1 || page > this.getTotalPages()) return;
    this.currentPage = page;
    this.updatePagedRecords(); 
  }

  getTotalPages(): number {
    return Math.ceil(this.eggRecords.length / this.itemsPerPage);
  }


  
}



