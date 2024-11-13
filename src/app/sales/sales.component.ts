import { Component, OnInit } from '@angular/core';
import { BirdRecord, SalesService } from '../services/sales.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  newSale: Partial<BirdRecord> = {
    date: '',
    birdType: '',
    sales: 0,
  };

  editMode = false;
  editIndex: number | null = null;
  salesList: BirdRecord[] = [];
  filteredSalesList: BirdRecord[] = [];
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;
  filterText = '';

  constructor(
    private salesService: SalesService,
    private modalService: NgbModal,
    private location: Location
  ) {}

  ngOnInit() {
    console.log('Initializing component and loading sales data...');
    this.loadSales();
  }

  goBack() {
    console.log('Navigating back...');
    this.location.back();
  }

  openSalesModal(content: any) {
    console.log('Opening sales modal...');
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: false,
    });
  }

  saveSale() {
    if (this.newSale.date && this.newSale.birdType && this.newSale.sales !== undefined) {
      const saleRecord: BirdRecord = {
        ...this.newSale,
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
      } as BirdRecord;

      if (this.editMode && this.editIndex !== null) {
        saleRecord.id = this.salesList[this.editIndex].id;
        this.updateSale(saleRecord);
      } else {
        this.createSale(saleRecord);
      }
    }
  }
  
  private updateSale(saleRecord: BirdRecord) {
    this.salesService.updateBirdRecord(saleRecord).subscribe({
      next: () => {
        this.salesList[this.editIndex!] = saleRecord;
        this.refreshSalesList();
      },
      error: (err) => console.error('Error updating record:', err)
    });
  }

  private createSale(saleRecord: BirdRecord) {
    this.salesService.saveBirdRecord(saleRecord).subscribe({
      next: (savedRecord) => {
        this.salesList.push(savedRecord);
        this.refreshSalesList();
      },
      error: (err) => console.error('Error saving record:', err)
    });
  }

  loadSales() {
    console.log('Loading sales data...');
    this.salesService.birdRecords$.subscribe(records => {
      this.salesList = records.filter(record => record.sales > 0);
      this.filteredSalesList = [...this.salesList];
      this.updatePagination();
    });
  }

  onEdit(index: number, content: any): void {
    console.log('Editing sale at index:', index);
    this.newSale = { ...this.salesList[index] };
    this.editMode = true;
    this.editIndex = index;
    this.openSalesModal(content);
  }

  deleteSale(sale: BirdRecord): void {
    if (sale.id !== undefined) {
      this.salesService.deleteSale(sale.id).subscribe({
        next: () => {
          this.salesList = this.salesList.filter(s => s.id !== sale.id);
          this.refreshSalesList();
        },
        error: (err) => {
          console.error('Error deleting sale:', err);
          alert('There was an error deleting the sale. Please try again later.');
        }
      });
    }
  }

  onDeleteClick(sale: BirdRecord) {
    const confirmDelete = confirm(`Are you sure you want to delete this sale: ${sale.birdType}?`);
    if (confirmDelete) {
      this.deleteSale(sale);
    }
  }

  trackByFn(index: number, item: BirdRecord) {
    return item.id;
  }

  resetForm() {
    console.log('Resetting form...');
    this.newSale = {
      date: '',
      birdType: '',
      sales: 0,
    };
    this.editMode = false;
    this.editIndex = null;
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
  }

  get currentSalesPage() {
    const start = (this.currentPage  - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredSalesList.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getTotalSales(): number {
    return this.salesList.reduce((total, sale) => total + sale.sales, 0);
  }

  private refreshSalesList() {
    this.filteredSalesList = [...this.salesList];
    this.updatePagination();
    this.resetForm();
    this.modalService.dismissAll();
  }
}
