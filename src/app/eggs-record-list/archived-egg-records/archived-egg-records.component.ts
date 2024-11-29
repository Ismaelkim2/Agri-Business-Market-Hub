import { Component, OnInit } from '@angular/core';
import { EggsRecordService, WeeklyEggRecord } from '../../services/eggsRecord.service';

@Component({
  selector: 'app-archived-egg-records',
  templateUrl: './archived-egg-records.component.html',
  styleUrls: ['./archived-egg-records.component.css']
})
export class ArchivedEggRecordsComponent implements OnInit {

  previousRecords: WeeklyEggRecord[] = [];

  constructor(private eggsRecordService: EggsRecordService) {}

  ngOnInit(): void {
    this.loadPreviousRecords();
  }

  loadPreviousRecords(): void {
    this.eggsRecordService.getPreviousWeeksData().subscribe(
      (data: any) => {  // Use 'any' to allow for flexible data types
        // Check if data is an array or an object
        if (Array.isArray(data)) {
          this.previousRecords = data;
        } else if (data && typeof data === 'object') {
          // If it's an object, consider it as a single record in an array
          this.previousRecords = [data];
        } else {
          console.error('Unexpected data format:', data);
          this.previousRecords = [];
        }
      },
      (error) => {
        console.error('Error fetching previous records:', error);
        this.previousRecords = [];
      }
    );
  }
}
