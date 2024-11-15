import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EggsRecord, EggsRecordService } from '../services/eggsRecord.service';

@Component({
  selector: 'app-eggs-record-list',
  templateUrl: './eggs-record-list.component.html',
  styleUrls: ['./eggs-record-list.component.css']
})
export class EggsRecordListComponent implements OnInit {
  eggsRecords: EggsRecord[] = []; 

  constructor(private eggsRecordService: EggsRecordService, private router: Router) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.eggsRecordService.getRecords().subscribe({
      next: (data) => {
        this.eggsRecords = data;
      },
      error: (err) => {
        console.error('Error fetching records:', err);
      }
    });
  }

  editRecord(record: any): void {
    this.router.navigate(['/edit-record', record.id]);
  }

  deleteRecord(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.eggsRecordService.deleteRecord(id).subscribe({
        next: () => {
          this.loadRecords();
        },
        error: (err) => {
          console.error('Error deleting record:', err);
        }
      });
    }
  }
}
