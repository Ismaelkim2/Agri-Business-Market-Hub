import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../services/records.service';
import { ExpenseService, ExpenseRecord } from '../services/expense.service';
import { BirdRecord, SalesService } from '../services/sales.service';
import { MortalitiesService, Mortality } from '../services/mortalities.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  monthlySales: { [month: number]: number } = {};
  monthlyExpenses: { [month: number]: number } = {};
  totalSalesAmount = 0;
  totalExpensesAmount = 0;
  salesList: BirdRecord[] = [];
  totalBirds = 0;
  totalMortalities = 0;
  mortalityRecords: Mortality[] = [];
  birdRecords: BirdRecord[] = [];
  expenseRecords: ExpenseRecord[] = [];
  selectedYear = new Date().getFullYear();
  years: number[] = [];
  selectedMonth = '';
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentPage = 1;
  itemsPerPage = 5;
  noDataForYear = false;

  constructor(
    private recordsService: RecordsService,
    private expenseService: ExpenseService,
    private salesService: SalesService,
    private mortalitiesService: MortalitiesService
  ) {}

  ngOnInit(): void {
    this.loadYears();
    this.fetchSalesRecords();
    this.fetchExpenseRecords();
    this.fetchTotalBirds();
    this.fetchMortalities();
  }

  loadYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  fetchTotalBirds(): void {
    this.recordsService.birdRecords$.subscribe(
      (records) => {
        this.birdRecords = records;
        this.totalBirds = this.birdRecords.reduce((sum, record) => sum + (record.count || 0), 0);
      },
      (error) => console.error('Error fetching bird records:', error)
    );
  }

  fetchMortalities(): void { 
    this.mortalitiesService.getMortalities().subscribe(
      (records) => {
        this.mortalityRecords = records;
        this.totalMortalities = this.mortalityRecords.reduce((sum, record) => sum + (record.numberOfMortalities || 0), 0);
      },
      (error) => console.error('Error fetching mortality records:', error)
    );
  }

  fetchSalesRecords(): void {
    this.salesService.birdRecords$.subscribe(
      (records) => {
        this.salesList = records;
        this.calculateMonthlySales(); 
      },
      (error) => console.error('Error fetching sales records:', error)
    );
  }

  fetchExpenseRecords(): void {
    this.expenseService.expenseRecords$.subscribe(
      (records) => {
        this.expenseRecords = records;
        this.calculateMonthlyExpenses();
      },
      (error) => console.error('Error fetching expense records:', error)
    );
  }

  onYearChange(): void {
    this.calculateMonthlySales();
    this.calculateMonthlyExpenses();
  }

  calculateMonthlySales(): void {
    this.monthlySales = {};
    this.totalSalesAmount = 0; // Reset total sales
    this.salesList.forEach(record => {
      const date = new Date(record.date);
      if (date.getFullYear() === this.selectedYear) {
        const month = date.getMonth() + 1;
        this.monthlySales[month] = (this.monthlySales[month] || 0) + record.sales;
        this.totalSalesAmount += record.sales; 
      }
    });
  }

  calculateMonthlyExpenses(): void {
    this.monthlyExpenses = {};
    this.totalExpensesAmount = 0; 
    this.expenseRecords.forEach(record => {
      const date = new Date(record.date);
      if (date.getFullYear() === this.selectedYear) {
        const month = date.getMonth() + 1;
        this.monthlyExpenses[month] = (this.monthlyExpenses[month] || 0) + record.amount;
        this.totalExpensesAmount += record.amount; 
      }
    });
  }

  getFilteredMonthlyRecords(): string[] {
    const filteredMonths = this.months.filter(month => {
      const monthIndex = this.getMonthIndex(month) + 1;
      return (this.monthlySales[monthIndex] || 0) > 0 || (this.monthlyExpenses[monthIndex] || 0) > 0;
    });

    this.noDataForYear = filteredMonths.length === 0;
    return filteredMonths;
  }

  getMonthIndex(month: string): number {
    return this.months.indexOf(month);
  }

  get totalPages(): number {
    return Math.ceil(this.getFilteredMonthlyRecords().length / this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  printMonthlyRecords(): void {
    window.print();
  }

   get effectiveTotalBirds(): number {
    return this.totalBirds - this.totalMortalities;
  }
}
