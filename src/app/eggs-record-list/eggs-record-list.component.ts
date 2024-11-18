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

  constructor(
    private router: Router,
    private eggsRecordService: EggsRecordService
  ) {}

  ngOnInit(): void {
    this.fetchRecords();
  }

  navigateToAddRecord(): void {
    this.router.navigate(['/eggs-record-form']);
  }

  fetchRecords(): void {
    this.eggsRecordService.getRecords().subscribe(
      (data: EggRecord[]) => {
        console.log('Fetched records:', data);
        this.eggRecords = data.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      },
      (error) => {
        console.error('Error fetching records:', error);
      }
    );
  }

  editRecord(record: EggRecord): void {
    this.eggsRecordService.updateRecord(record.id, record).subscribe(
      () => {
        console.log('Record updated successfully');
        const index = this.eggRecords.findIndex(r => r.id === record.id);
        if (index !== -1) {
          this.eggRecords[index] = record; 
        }
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
      },
      (error) => {
        console.error('Failed to delete record:', error);
      }
    );
  }
}
