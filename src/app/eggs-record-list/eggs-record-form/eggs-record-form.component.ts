import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EggsRecordService } from '../../services/eggsRecord.service';
import { EggRecord } from '../eggs-record-list.component';


@Component({
  selector: 'app-eggs-record-form',
  templateUrl: './eggs-record-form.component.html',
  styleUrls: ['./eggs-record-form.component.css'],
})
export class EggsRecordFormComponent implements OnInit {
  record: EggRecord = { id: 0, date: new Date(), eggsCount: 0 };
  editMode = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private router: Router, private eggsRecordService: EggsRecordService) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['record']) {
      this.record = navigation.extras.state['record'];
      this.editMode = true;
      this.record.date = new Date(this.record.date).toISOString().split('T')[0] as unknown as Date;
    }
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
          setTimeout(() => this.router.navigate(['/eggs-record-list']), 2000);
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
          setTimeout(() => this.router.navigate(['/eggs-record-list']), 2000);
        },
        (error) => {
          console.error('Record added successfully.');
          setTimeout(() => this.router.navigate(['/eggs-record-list']), 2000);
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/eggs-record-list']);
  }
}

