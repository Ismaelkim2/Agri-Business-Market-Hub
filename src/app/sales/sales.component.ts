import { Component, OnInit, Renderer2 } from '@angular/core';
import {  SalesRecord, SalesService } from '../services/sales.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  newSale: Partial<SalesRecord> = {
    date: '',
    birdType: '',
    sales: 0,
  };

  editMode = false;
  editIndex: number | null = null;
  salesList: SalesRecord[] = [];
  filteredSalesList: SalesRecord[] = [];
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;
  currentSalesPage: SalesRecord[] = [];
  filterText = '';

  constructor(
    private salesService: SalesService,
    private modalService: NgbModal,
    private location: Location,
    private renderer: Renderer2 
  ) {}

  ngOnInit() {
    this.loadSales();
  }

  goBack() {
    this.location.back();
  }

  openSalesModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: false,
    }).result.finally(() => {
      this.renderer.removeAttribute(document.querySelector('app-sidebar'), 'aria-hidden');
      this.renderer.removeAttribute(document.querySelector('.main-container'), 'aria-hidden');
    });

    this.renderer.setAttribute(document.querySelector('app-sidebar'), 'aria-hidden', 'true');
    this.renderer.setAttribute(document.querySelector('.main-container'), 'aria-hidden', 'true');
  }

  saveSale() {
    if (this.newSale.date && this.newSale.birdType && this.newSale.sales !== undefined) {
      const saleRecord: SalesRecord = {
        ...this.newSale,
        id: this.editMode && this.editIndex !== null ? this.salesList[this.editIndex].id : undefined,
        eggProduction: 0,
        feedConsumption: '',
        expenses: 0,
        vaccineRecords: [{ vaccine: '', date: '' }],
        hatchDate: '',
        totalBirds: 0,
        newFlock: 0,
        mortalities: 0,
        hatchdata: '',
        birdCount: 0,
        sold: true,
        count: 1,
        salesAmount: this.newSale.sales!
      } as SalesRecord;

      if (this.editMode) {
        this.updateSale(saleRecord);
      } else {
        this.createSale(saleRecord);
      }
    }
  }

  private updateSale(saleRecord: SalesRecord) {
    this.salesService.updateBirdRecord(saleRecord).subscribe({
      next: () => {
        this.salesList[this.editIndex!] = saleRecord;
        this.refreshSalesList();
      },
      error: (err) => console.error('Error updating record:', err)
    });
  }

  private createSale(saleRecord: SalesRecord) {
    this.salesService.saveBirdRecord(saleRecord).subscribe({
      next: (savedRecord) => {
        this.salesList.push(savedRecord);
        this.refreshSalesList();
      },
      error: (err) => console.error('Error saving record:', err)
    });
  }

  loadSales() {
    this.salesService.SalesRecord$.subscribe(records => {
      this.salesList = records.filter(record => record.sales > 0);
      this.filteredSalesList = [...this.salesList];
      this.updatePagination();
    });
  }

  filterSales() {
    this.filteredSalesList = this.salesList.filter(sale =>
      sale.birdType.toLowerCase().includes(this.filterText.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredSalesList.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.updateCurrentSalesPage();
  }

  updateCurrentSalesPage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.currentSalesPage = this.filteredSalesList.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateCurrentSalesPage();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateCurrentSalesPage();
    }
  }

  getTotalSales(): number {
    return this.salesList.reduce((total, sale) => total + sale.sales, 0);
  }

  private refreshSalesList() {
    this.salesService.loadBirdRecords();
    this.filteredSalesList = [...this.salesList];
    this.updatePagination();
    this.resetForm();
    this.modalService.dismissAll();
  }

  onEdit(index: number, content: any): void {
    this.newSale = { ...this.salesList[index] };
    this.editMode = true;
    this.editIndex = index;
    this.openSalesModal(content);
  }

  deleteSale(sale: SalesRecord): void {
    if (sale.id !== undefined) {
      this.salesService.deleteSale(sale.id).subscribe({
        next: () => {
          this.salesList = this.salesList.filter(s => s.id !== sale.id);
          this.refreshSalesList();
        },
        error: (err) => console.error('Error deleting sale:', err)
      });
    }
  }

  onDeleteClick(sale: SalesRecord) {
    const confirmDelete = confirm(`Are you sure you want to delete this sale: ${sale.birdType}?`);
    if (confirmDelete) {
      this.deleteSale(sale);
    }
  }

  trackByFn(index: number, item: SalesRecord) {
    return item.id;
  }

  resetForm() {
    this.newSale = {
      date: '',
      birdType: '',
      sales: 0,
    };
    this.editMode = false;
    this.editIndex = null;
  }
}
