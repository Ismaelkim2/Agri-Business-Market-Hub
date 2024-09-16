import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {

  dailyRecords: { 
    date: string, 
    eggProduction: number, 
    feedConsumption: number, 
    vaccineRecords: number,
    totalBirds: number, 
    newFlock: number, 
    mortalities: number 
  }[] = [];
  
  weeklySummary: { 
    week: string, 
    eggProduction: number, 
    feedConsumption: number, 
    vaccineRecords: number,
    totalBirds: number, 
    newFlock: number, 
    mortalities: number 
  }[] = [];

  selectedRecordIndex: number | null = null;
  selectedRecord: { 
    date: string, eggProduction: number, feedConsumption: number, vaccineRecords: number, 
    index: number,totalBirds:number,newFlock:number,mortalities:number } | null = null;
  chartEggProductionLabels: string[] = [];
  chartFeedConsumptionLabels: string[] = [];
  chartVaccineRecordsLabels: string[] = [];
  chartEggProductionValues: number[] = [];
  chartFeedConsumptionValues: number[] = [];
  chartVaccineRecordsValues: number[] = [];
  chartTotalBirdsLabels: string[] = [];
chartNewFlockLabels: string[] = [];
chartMortalitiesLabels: string[] = [];
chartTotalBirdsValues: number[] = [];
chartNewFlockValues: number[] = [];
chartMortalitiesValues: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadRecords();
    this.calculateWeeklySummary();
    this.prepareChartData();
  }
  loadRecords(): void {
    const storedRecords = localStorage.getItem('poultryRecords');
    if (storedRecords) {
      this.dailyRecords = JSON.parse(storedRecords).map((record: any) => ({
        ...record,
        eggProduction: Number(record.eggProduction),
        feedConsumption: Number(record.feedConsumption),
        vaccineRecords: Number(record.vaccineRecords),
        totalBirds: Number(record.totalBirds),
        newFlock: Number(record.newFlock),
        mortalities: Number(record.mortalities)
      }));
    }
  }
  

  saveRecord(formValues: any): void {
    const record = {
      date: formValues.date,
      eggProduction: formValues.eggProduction,
      feedConsumption: formValues.feedConsumption,
      vaccineRecords: formValues.vaccineRecords,
      totalBirds: formValues.totalBirds,
      newFlock: formValues.newFlock,
      mortalities: formValues.mortalities
    };
    this.dailyRecords.push(record);
    localStorage.setItem('poultryRecords', JSON.stringify(this.dailyRecords));
    this.calculateWeeklySummary();
    this.prepareChartData();
  }
  
  editRecord(index: number): void {
    this.selectedRecordIndex = index;
    this.selectedRecord = { ...this.dailyRecords[index], index };
  }

  updateRecord(): void {
    if (this.selectedRecord?.index !== undefined) {
      // Ensure all required properties are present in the updated record
      this.dailyRecords[this.selectedRecord.index] = {
        ...this.dailyRecords[this.selectedRecord.index], // Preserve other properties if they exist
        date: this.selectedRecord.date,
        eggProduction: this.selectedRecord.eggProduction,
        feedConsumption: this.selectedRecord.feedConsumption,
        vaccineRecords: this.selectedRecord.vaccineRecords,
        totalBirds: this.selectedRecord.totalBirds, // Ensure this property is set
        newFlock: this.selectedRecord.newFlock, // Ensure this property is set
        mortalities: this.selectedRecord.mortalities // Ensure this property is set
      };
      localStorage.setItem('poultryRecords', JSON.stringify(this.dailyRecords));
      this.calculateWeeklySummary();
      this.prepareChartData();
      this.selectedRecordIndex = null;
      this.selectedRecord = null;
    }
  }
  

  deleteRecord(index: number): void {
    this.dailyRecords.splice(index, 1);
    localStorage.setItem('poultryRecords', JSON.stringify(this.dailyRecords));
    this.calculateWeeklySummary();
    this.prepareChartData();
  }

  calculateWeeklySummary(): void {
    const weeklyData: { 
      [key: string]: { 
        eggProduction: number, 
        feedConsumption: number, 
        vaccineRecords: number,
        totalBirds: number,
        newFlock: number,
        mortalities: number 
      } 
    } = {};
    
    let currentWeek = 1;
    let currentWeekStartDate: Date | null = null;
  
    this.dailyRecords.forEach((record) => {
      const recordDate = new Date(record.date);
      if (!currentWeekStartDate) {
        currentWeekStartDate = recordDate;
      }
  
      const dayDifference = Math.floor((recordDate.getTime() - currentWeekStartDate.getTime()) / (1000 * 60 * 60 * 24));
  
      if (dayDifference >= 7) {
        currentWeek++;
        currentWeekStartDate = recordDate;
      }
  
      const weekKey = `Week ${currentWeek}`;
  
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { 
          eggProduction: 0, 
          feedConsumption: 0, 
          vaccineRecords: 0,
          totalBirds: 0,
          newFlock: 0,
          mortalities: 0
        };
      }
  
      weeklyData[weekKey].eggProduction += record.eggProduction;
      weeklyData[weekKey].feedConsumption += record.feedConsumption;
      weeklyData[weekKey].vaccineRecords += record.vaccineRecords;
      weeklyData[weekKey].totalBirds += record.totalBirds;
      weeklyData[weekKey].newFlock += record.newFlock;
      weeklyData[weekKey].mortalities += record.mortalities;
    });
  
    this.weeklySummary = Object.keys(weeklyData).map(week => ({
      week,
      ...weeklyData[week]
    }));
  }
  

  prepareChartData(): void {
    this.chartEggProductionLabels = this.weeklySummary.map(record => record.week);
    this.chartFeedConsumptionLabels = this.weeklySummary.map(record => record.week);
    this.chartVaccineRecordsLabels = this.weeklySummary.map(record => record.week);
    this.chartTotalBirdsLabels = this.weeklySummary.map(record => record.week);
    this.chartNewFlockLabels = this.weeklySummary.map(record => record.week);
    this.chartMortalitiesLabels = this.weeklySummary.map(record => record.week);
  
    this.chartEggProductionValues = this.weeklySummary.map(record => record.eggProduction);
    this.chartFeedConsumptionValues = this.weeklySummary.map(record => record.feedConsumption);
    this.chartVaccineRecordsValues = this.weeklySummary.map(record => record.vaccineRecords);
    this.chartTotalBirdsValues = this.weeklySummary.map(record => record.totalBirds);
    this.chartNewFlockValues = this.weeklySummary.map(record => record.newFlock);
    this.chartMortalitiesValues = this.weeklySummary.map(record => record.mortalities);
  }

  scrollLeft() {
    const container = document.querySelector('.weekly-summary-cards-section');
    container?.scrollBy({ left: -200, behavior: 'smooth' });
  }
  
   scrollRight() {
    const container = document.querySelector('.weekly-summary-cards-section');
    container?.scrollBy({ left: 200, behavior: 'smooth' });
  }
  
}
