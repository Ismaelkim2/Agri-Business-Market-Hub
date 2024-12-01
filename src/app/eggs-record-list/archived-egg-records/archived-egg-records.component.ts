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

  viewSize: [number, number] = [1000, 400];

  constructor(private eggsRecordService: EggsRecordService, private location: Location) {}

  ngOnInit(): void {
    this.updateChartSize();
    this.loadPreviousRecords();
  }

  @HostListener('window:resize')
  updateChartSize(): void {
    const screenWidth = window.innerWidth;
    if (screenWidth < 576) {
      this.viewSize = [300, 250];
    } else if (screenWidth < 768) {
      this.viewSize = [400, 300];
    } else if (screenWidth < 1024) {
      this.viewSize = [700, 400];
    } else {
      this.viewSize = [1000, 400];
    }
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

        this.chartData = [
          {
            name: 'Weekly Egg Counts',
            series: this.previousRecords.map((record) => ({
              name: `${record.startOfWeek.toLocaleDateString()} - ${record.endOfWeek.toLocaleDateString()}`,
              value: record.eggsCount,
            })),
          },
          {
            name: 'Broken Eggs',
            series: this.previousRecords.map((record) => ({
              name: `${record.startOfWeek.toLocaleDateString()} - ${record.endOfWeek.toLocaleDateString()}`,
              value: record.brokenEggsCount,
            })),
          },
        ];
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
