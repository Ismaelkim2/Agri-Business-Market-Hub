import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceService } from '../data-service.service';
import { BirdRecord, RecordsService } from '../services/records.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string = '';
  totalBirds: number = 0;
  dailyEggProduction: number = 0;
  feedConsumption: number = 0;
  mortalityRate: number = 0;
  recentActivities: string[] = [];
  alerts: string[] = [];

  constructor(
    private router: Router,
    private dataService: DataServiceService,
    private recordsService: RecordsService
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.dataService.loggedInUser.subscribe(user => {
      if (user) {
        this.username = user.name || 'Ismael';
      }
    });

 
    this.recordsService.getTotalBirds().subscribe(totalBirds => this.totalBirds = totalBirds);
    
    this.recordsService.birdRecords$.subscribe((records: BirdRecord[]) => {
      this.updateStatistics(records);
      this.updateRecentActivities(records);
    });

   
    this.alerts = [
      'Low feed stock, consider restocking soon!',
      'High mortality rate detected this week!',
      'Egg production decreased by 5% from last week'
    ];
  }

  updateStatistics(records: BirdRecord[]): void {
    const latestRecord = records[0];
    this.dailyEggProduction = latestRecord ? latestRecord.eggProduction : 0;
    this.feedConsumption = latestRecord ? parseInt(latestRecord.feedConsumption) : 0;
    this.mortalityRate = records.reduce((acc, record) => acc + record.mortalities, 0) / records.length;
  }

  updateRecentActivities(records: BirdRecord[]): void {
    this.recentActivities = records.map(record => {
      return `Recorded ${record.count} birds on ${record.date}, ${record.eggProduction} eggs produced`;
    }).slice(0, 4);  
  }

  poultry() {
    this.router.navigate(['/product-list']);
  }

  products() {
    this.router.navigate(['/product-list']);
  }
}
