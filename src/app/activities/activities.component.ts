import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  activities: string[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state;
    this.activities = state.recentActivities || [];
  }


  removeActivity(activity: string): void {
    this.activities = this.activities.filter(a => a !== activity);
  }
}

