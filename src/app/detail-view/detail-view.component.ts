import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BirdRecord, RecordsService } from '../services/records.service';
import { SalesRecord, SalesService } from '../services/sales.service';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css'],
})
export class DetailViewComponent implements OnInit, OnDestroy {
  cardType: string = '';
  monthlyData: any[] = [];
  summaryData: any[] = [];
  birdRecords: BirdRecord[] = [];
  salesRecord: SalesRecord[] = [];
  chart: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private recordsService: RecordsService,
    private salesService: SalesService
  ) {
    Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
  }

  ngOnInit(): void {
    this.cardType = this.route.snapshot.paramMap.get('type') || '';
    this.loadData();
  }

  goBack(): void {
    this.location.back();
  }

  loadData(): void {
    if (this.cardType === 'birds') {
      this.loadBirdRecords();
    } else if (this.cardType === 'sales') {
      this.loadSalesRecords();
    }
  }

  loadBirdRecords(): void {
    this.recordsService.getBirdRecords().subscribe((records) => {
      this.birdRecords = records;
      this.generateGraph(this.birdRecords, 'Bird Count');
    });
  }

  loadSalesRecords(): void {
    this.salesService.SalesRecord$.subscribe((records) => {
      this.salesRecord = records;
      this.summaryData = records.map((record) => ({
        category: record.birdType,
        percentage: ((record.salesAmount / this.calculateTotalSales()) * 100).toFixed(2),
        amount: record.salesAmount,
      }));
      this.generateGraph(this.salesRecord, 'Sales Amount');
    });
  }

  calculateTotalSales(): number {
    return this.salesRecord.reduce((total, record) => total + record.salesAmount, 0);
  }

  generateGraph(records: (BirdRecord | SalesRecord)[], label: string): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = records.map((record) => record.date);
    const data = records.map((record) => record.salesAmount || record.birdCount);

    this.chart = new Chart('graphCanvas', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label,
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

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
