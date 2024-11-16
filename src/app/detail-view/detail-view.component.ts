import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css'],
})
export class DetailViewComponent implements OnInit {
  cardType: string = '';
  monthlyData: any[] = [];
  summaryData: any[] = [];
  chart: any;

  constructor(private route: ActivatedRoute,
    private location:Location,
  ) {
    Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
  }

  ngOnInit(): void {
    this.cardType = this.route.snapshot.paramMap.get('type') || '';
    this.loadData();
  }

  goBack(){
    this.location.back();
  }

  loadData(): void {
    if (this.cardType === 'sales') {
      this.monthlyData = [
        { month: 'January', amount: 12000 },
        { month: 'February', amount: 1500 },
        { month: 'March', amount: 15000 },
        { month: 'April', amount: 20000 },
        { month: 'May', amount: 15000 },
        { month: 'Jun', amount: 20000 },
        { month: 'July', amount: 34000 },
        { month: 'Aug', amount: 15000 },
        { month: 'Sept', amount: 70000 },
        { month: 'Oct', amount: 20000 },
        { month: 'Nov', amount: 4000 },
        { month: 'Dec', amount: 15000 },
      ];
      this.summaryData = [
        { category: 'Eggs', percentage: 20, amount: 20000 },
        { category: 'Hens', percentage: 15, amount: 15000 },
        { category: 'Cocks', percentage: 20, amount: 20000 },
        { category: 'Drinkers', percentage: 15, amount: 15000 },
        { category: 'Retail', percentage: 20, amount: 20000 },
        { category: 'Wholesale', percentage: 15, amount: 15000 },
      ];
    }
    this.generateGraph();
  }

  generateGraph(): void {
    const labels = this.monthlyData.map((data) => data.month);
    const data = this.monthlyData.map((data) => data.amount);

    this.chart = new Chart('graphCanvas', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: `${this.cardType} Amounts`,
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `${this.cardType} Trends`,
          },
        },
      },
    });
  }
}
