import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EggsRecordService } from '../services/eggsRecord.service';

export interface EggRecord {
  id: number;
  date: Date;
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
  itemsPerPage: number = 4; // Set the default items per page

  constructor(
    private router: Router,
    private eggsRecordService: EggsRecordService
  ) {}

  ngOnInit(): void {
    this.fetchRecords();
  }

  fetchRecords(): void {
    this.eggsRecordService.getRecords().subscribe(
      (data: EggRecord[]) => {
        console.log('Fetched records:', data);
        this.eggRecords = data.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        this.updatePagedRecords(); // Update the paged records after fetching
      },
      (error) => {
        console.error('Error fetching records:', error);
      }
    );
  }

  updatePagedRecords(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedRecords = this.eggRecords.slice(startIndex, startIndex + this.itemsPerPage);
  }

  navigateToAddRecord(): void {
    this.router.navigate(['/eggs-record-form']);
  }

  editRecord(record: EggRecord): void {
    this.eggsRecordService.updateRecord(record.id, record).subscribe(
      () => {
        console.log('Record updated successfully');
        const index = this.eggRecords.findIndex(r => r.id === record.id);
        if (index !== -1) {
          this.eggRecords[index] = record;
        }
        this.updatePagedRecords(); // Reapply pagination after update
      },
      (error) => {
        console.error('Error updating record:', error);
      }
    );
    this.router.navigate(['/eggs-record-form'], { state: { record } });
  }

  deleteRecord(id: number): void {
    this.eggsRecordService.deleteRecord(id).subscribe(
      () => {
        console.log(`Record with ID ${id} deleted successfully.`);
        this.eggRecords = this.eggRecords.filter(record => record.id !== id);
        this.updatePagedRecords(); // Reapply pagination after deletion
      },
      (error) => {
        console.error('Failed to delete record:', error);
      }
    );
  }

  // Pagination Controls
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
