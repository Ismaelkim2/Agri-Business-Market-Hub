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
  chartData: any[] = [];
  errorMessage: string = '';

  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#A10A28', '#AAAAAA'],
  };

  isSmallScreen: boolean = false;

  viewSize: [number, number] = [1000, 400];

  constructor(private eggsRecordService: EggsRecordService,private location: Location) {}

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

  goBack() {
    this.location.back();
  }

  loadPreviousRecords(): void {
    this.eggsRecordService.getPreviousWeeksData().subscribe(
      (data: WeeklyEggRecord[]) => {
        const sortedRecords = data
          .map((record) => ({
            ...record,
            startOfWeek: new Date(record.startOfWeek),
            endOfWeek: new Date(record.endOfWeek),
          }))
          .sort((a, b) => a.startOfWeek.getTime() - b.startOfWeek.getTime());
  
        this.previousRecords = [...sortedRecords].reverse(); 
  
        this.chartData = [
          {
            name: 'Weekly Egg Counts',
            series: sortedRecords.map((record) => ({
              name: `${record.startOfWeek.toLocaleDateString()} - ${record.endOfWeek.toLocaleDateString()}`,
              value: record.eggsCount,
            })),
          },
          {
            name: 'Broken Eggs',
            series: sortedRecords.map((record) => ({
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
  
}
