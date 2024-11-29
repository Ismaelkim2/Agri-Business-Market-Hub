import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EggsRecordService } from '../../services/eggsRecord.service';
import { EggRecord } from '../eggs-record-list.component';

@Component({
  selector: 'app-eggs-record-form',
  templateUrl: './eggs-record-form.component.html',
  styleUrls: ['./eggs-record-form.component.css'],
})
export class EggsRecordFormComponent implements OnInit {
  record: EggRecord = { id: 0, date: new Date(), eggsCount: 0 ,brokenEggsCount: 0};
  editMode = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showNotification: boolean = false;
  showSpinner: boolean = true;
  showTick: boolean = false;

  constructor(
    private router: Router,
    private eggsRecordService: EggsRecordService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;
  
    if (state?.['record']) {
      this.record = state['record'];
      this.editMode = true;
  
      if (this.record.date) {
        this.record.date = this.formatDate(new Date(this.record.date));
      }
    } else {
      console.error('No navigation state found!');
    }
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; 
  }
  
  saveRecord(): void {
    if (!this.record.date || this.record.eggsCount <= 0) {
      this.errorMessage = 'Please provide a valid date and egg count.';
      return;
    }
  
    if (this.editMode) {
      this.eggsRecordService.updateRecord(this.record.id, this.record).subscribe(
        () => {
          this.successMessage = 'Record updated successfully.';
          this.showSuccessNotification(this.successMessage, () =>
            this.router.navigate(['/eggs-record-list'])
          );
        },
        (error) => {
          console.error('Failed to update the record:', error);
          this.errorMessage = 'Failed to update the record.';
        }
      );
    } else {
      this.eggsRecordService.addRecord(this.record).subscribe(
        () => {
          this.successMessage = 'Record added successfully.';
          this.showSuccessNotification(this.successMessage, () =>
            this.router.navigate(['/eggs-record-list'])
          );
        },
        (error) => {
          console.error('Failed to add the record:', error);
          this.errorMessage = 'Failed to add the record.';
        }
      );
    }
  }
  

  private convertToDate(date: any): Date {
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid Date string');
      }
      return parsedDate;
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date;
    }
    throw new Error('Invalid Date object');
  }

  cancel(): void {
    this.router.navigate(['/eggs-record-list']);
  }

  showSuccessNotification(message: string, callback: () => void): void {
    this.showNotification = true;
    this.showSpinner = true;
    this.showTick = false;
  
    setTimeout(() => {
      this.showSpinner = false;
      this.showTick = true;
  
      setTimeout(() => {
        this.showNotification = false; 
        callback();
      }, 1000); 
    }, 3000); 
  }
  
  
}
