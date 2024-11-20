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
import { ExpenseRecord, ExpenseService } from '../services/expense.service';

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
  expensesRecord:ExpenseRecord[]=[];
  chart: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private recordsService: RecordsService,
    private salesService: SalesService,
    private expenseService:ExpenseService
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
    } else if (this.cardType === 'expense') {
      this.loadExpenseRecords();
    } else if (this.cardType === 'profit') {
      this.loadSalesRecords(); 
    }
  }

 loadBirdRecords(): void {
  this.recordsService.getBirdRecords().subscribe((records) => {
    const groupedRecords = records.reduce((acc, record) => {
      acc[record.birdType] = acc[record.birdType] || { birdType: record.birdType, count: 0 };
      acc[record.birdType].count += record.count;
      return acc;
    }, {} as { [key: string]: { birdType: string; count: number } });

    const totalBirds = Object.values(groupedRecords).reduce((sum, group) => sum + group.count, 0);
    this.birdRecords = Object.values(groupedRecords).map((group) => ({
      ...group,
      totalBirds,
    })) as any [];
  });
}

calculatePercentage(count?: number, totalBirds?: number): string {
  if (!count || !totalBirds) {
    return '0';
  }
  return ((count / totalBirds) * 100).toFixed(2);
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

  loadExpenseRecords(): void {
    this.expenseService.expenseRecords$.subscribe((records) => {
      this.expensesRecord = records;
      this.summaryData = records.map((record) => ({
        category: record.expenseType,
        amount: record.amount,
      }));
      this.generateGraph(this.expensesRecord, 'Expense Amount'); 
    });
  }
  
  
  calculateTotalSales(): number {
    return this.salesRecord.reduce((total, record) => total + record.salesAmount, 0);
  }

  generateGraph(records: (BirdRecord | SalesRecord | ExpenseRecord)[], label: string): void {
    console.log('Generating graph for:', this.cardType, records);
    if (this.chart) {
      this.chart.destroy();
    }
  
    let labels: string[] = [];
    let data: number[] = [];
  
    switch (this.cardType) {
      case 'sales':
        labels = (records as SalesRecord[]).map((record) => record.birdType || 'Unknown');
        data = (records as SalesRecord[]).map((record) => record.sales || 0);
        break;
        case 'expense':
          labels = (records as ExpenseRecord[]).map((record) => record.expenseType || 'Unknown');
          data = (records as ExpenseRecord[]).map((record) => record.amount || 0);
          break;
        
      case 'profit':
        labels = (records as SalesRecord[]).map((record) => record.date || 'Unknown');
        data = (records as SalesRecord[]).map(
          (record) => (record.sales || 0) - ((record as any).expenses || 0)
        );
        break;
      case 'birds':
        labels = (records as BirdRecord[]).map((record) => record.birdType || 'Unknown');
        data = (records as BirdRecord[]).map((record) => record.count || 0);
        break;
      default:
        labels = [];
        data = [];
    }
  
    this.chart = new Chart('graphCanvas', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: `${this.cardType.charAt(0).toUpperCase() + this.cardType.slice(1)} Data`,
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
            text: `${this.cardType.charAt(0).toUpperCase() + this.cardType.slice(1)} Trends`,
          },
        },
      },
    });
  }

  get totalSales(){
  return  this.salesRecord.reduce((total,record)=>total+record.sales,0)
  }

  get totalExpenses(){
    return this.expensesRecord.reduce((total,record)=>total+ record.amount,0)
  }
  
  
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
