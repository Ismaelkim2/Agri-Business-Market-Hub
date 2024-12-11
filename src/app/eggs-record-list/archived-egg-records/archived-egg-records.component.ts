import { Component, HostListener, OnInit } from '@angular/core';
import { EggsRecordService, WeeklyEggRecord } from '../../services/eggsRecord.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-archived-egg-records',
  templateUrl: './archived-egg-records.component.html',
  styleUrls: ['./archived-egg-records.component.css'],
})
export class ArchivedEggRecordsComponent implements OnInit {
  previousRecords: WeeklyEggRecord[] = [];
  previousWeekRecords: any[] = [];
  chartData: any[] = [];
  errorMessage: string = '';

  showModal: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#A10A28', '#AAAAAA'],
  };
  viewSize: [number, number] = [window.innerWidth, window.innerHeight];
  width: number = window.innerWidth;
  height: number = window.innerHeight;

  constructor(private eggsRecordService: EggsRecordService, private location: Location) {}

  ngOnInit(): void {
    this.updateChartSize();
    this.loadPreviousRecords();
  }

  @HostListener('window:resize')

updateChartSize(): void {
  const width = window.innerWidth;
  const height = window.innerHeight;
  this.viewSize = [width * 0.9, height * 0.4]; 
  this.width = this.viewSize[0];
  this.height = this.viewSize[1];
}


  goBack(): void {
    this.location.back();
  }

  loadPreviousRecords(): void {
    this.eggsRecordService.getPreviousWeeksData().subscribe(
      (data: WeeklyEggRecord[]) => {
        this.previousRecords = data
          .map((record) => ({
            ...record,
            startOfWeek: new Date(record.startOfWeek),
            endOfWeek: new Date(record.endOfWeek),
          }))
          .sort((a, b) => b.startOfWeek.getTime() - a.startOfWeek.getTime());
  
        // Prepare chartData for bar graph
        this.chartData = this.previousRecords.map((record) => ({
          name: `${record.startOfWeek.toLocaleDateString()} - ${record.endOfWeek.toLocaleDateString()}`,
          value: record.eggsCount,
        }));
      },
      (error) => {
        console.error('Error fetching previous records:', error);
        this.errorMessage = 'Failed to load previous records. Please try again later.';
      }
    );
  }
  
  viewPreviousWeekData(record: WeeklyEggRecord): void {
    this.eggsRecordService.getDailyRecordsForWeek(record.startOfWeek, record.endOfWeek).subscribe({
      next: (data) => {
        this.previousWeekRecords = data;
        this.showModal = true;
      },
      error: (error) => {
        console.error('Error fetching daily records:', error);
        this.errorMessage = 'Failed to load daily records. Please try again later.';
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
  }

  getTotalEggsForWeek(): number {
    return this.previousWeekRecords.reduce((total, record) => total + record.eggsCount, 0);
  }
  
}
