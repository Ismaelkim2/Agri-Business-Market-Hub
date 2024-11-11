import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core'; 
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { BirdRecord, DailyRecord, RecordsService, WeeklySummary } from '../services/records.service';
import { DataServiceService } from '../data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-farm-data',
  templateUrl: './farm-data.component.html',
  styleUrls: ['./farm-data.component.css'],
})
export class FarmDataComponent implements OnInit, OnDestroy {
  formData: any = {};
  isEditMode: boolean = false;
  selectedIndex: number = -1;
  isModalOpen = false;
  isEditing: boolean = false;
  poultryIndex: number | null = 0;
  soldBirds: BirdRecord[] = []; 
  isSavedArray: boolean[] = [];
  showNotification: boolean = false;

  isLoggedInSubscription: Subscription = new Subscription();
  isLoggedIn:boolean=false;


  isLargeScreen = window.innerWidth >= 992;
  isSidebarOpen = false;

  filterTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  filteredPoultryRecords: BirdRecord[] = [];

  newHatchData = {
    hatchDate: '',
    birdType: '',
    birdCount: 0,
    role:''
    
  };

  birdRecords: BirdRecord[] = [];
  dailyRecords: DailyRecord[] = [];
  weeklySummary: WeeklySummary[] = [];
  totalBirds: number = 0;
  birdTypes: string[] = ['Improved Kienyeji', 'Kienyeji', 'Chicks'];
  poultryTypes: BirdRecord[] = [];
  subscriptions: Subscription[] = [];

  constructor(private recordsService: RecordsService,
    private cd:ChangeDetectorRef,
    private dataservice:DataServiceService,
    private recordService:RecordsService,
  private location:Location,
  private router :Router
   ) {

  }

  goBack(){
    this.location.back();
  }

  onSubmit() {
    const newBirdRecord: BirdRecord = {
      ...this.newHatchData,
      date: new Date(this.newHatchData.hatchDate).toISOString().split('T')[0],
      count: this.newHatchData.birdCount,
      eggProduction: 0,  
      feedConsumption: this.getFeedType(this.calculateAgeInDays(this.newHatchData.hatchDate)),
      vaccineRecords: [this.getNextVaccine(this.calculateAgeInDays(this.newHatchData.hatchDate), this.newHatchData.hatchDate)],
      hatchdata: this.newHatchData.hatchDate,
      totalBirds: this.newHatchData.birdCount,
      newFlock: this.newHatchData.birdCount,
      mortalities: 0,
      sold: false,
      sales:0,
      expenses:0,
      vaccinationType: '',
      dateAdministered:'' , 
      name:'',             
      dosage: 0,         
      administeredBy: '',
      remarks: '' ,  
      type: '' ,
      id:0,
      salesAmount:0
     
    };
    this.toggleModal();

    this.recordsService.saveBirdRecord(newBirdRecord).subscribe(() => {});
  }

  ngOnInit(): void {

 this.subscriptions.push(
    this.recordsService.getBirdRecords().subscribe(
      (records) => {
        this.birdRecords = records;
        this.poultryTypes = records;
        this.applyFilter();
      },
      (error) => {
        console.error('Error fetching bird records:', error);
      }
    )
  );

    this.subscriptions.push(
      this.recordsService.getTotalBirds().subscribe((total) => {
        console.log('total bird',total)
        this.totalBirds = total;
      })
    );
    this.isLoggedInSubscription = this.dataservice.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      }
    });
  
    if (this.isLoggedIn) {
      this.subscriptions.push(
        this.recordsService.birdRecords$.subscribe((records) => {
          this.birdRecords = records;
          this.poultryTypes = records;
          this.applyFilter();
        })
      );
  }
}

  ngOnDestroy(): void {
    this.isLoggedInSubscription.unsubscribe();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  onSellBird(index: number): void {
    const confirmSell = confirm('Are you sure you want to mark this bird as sold?');
    if (confirmSell) {
      const recordIndex = (this.currentPage - 1) * this.itemsPerPage + index;
      this. filteredPoultryRecords[recordIndex].sold = true;
      this.applyFilter();  
    }
  }
  
  
  onDeleteBird(index: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this bird record?');
    if (confirmDelete) {
      const recordId = this.filteredPoultryRecords[index].id; 
      if (recordId !== undefined) {
        this.recordsService.deleteBirdRecord(recordId).subscribe(
          () => {
            this.filteredPoultryRecords.splice(index, 1);
            this.applyFilter();
            alert('Bird record deleted successfully');
          },
          (error) => {
            console.error('Error deleting bird record:', error);
            alert('Failed to delete bird record');
          }
        );
      } else {
        console.error('Record ID is undefined');
        alert('Cannot delete bird record: ID is missing');
      }
    }
  }
  
  openAddModal() {
    this.isEditMode = false;
    this.formData = {}; 
    this.isModalOpen = true;
  }

  openEditModal(record: any, index: number) {
    this.isEditMode = true;
    this.selectedIndex = index;
    this.formData = { ...record }; 
    this.isModalOpen = true;
  }

  onEditFarm(index: number): void {
    this.isEditing = true; 
    this.poultryIndex = index; 
    const recordIndex = (this.currentPage - 1) * this.itemsPerPage + index;
    this.formData = { ...this.filteredPoultryRecords[recordIndex] };
  }

  onSaveChanges(index: number) {
    console.log('Saving changes for record:', this.filteredPoultryRecords[index]);
  
    const updatedRecord = JSON.parse(JSON.stringify(this.filteredPoultryRecords[index]));
  
    this.recordsService.updateBirdRecord(updatedRecord).subscribe(() => {
      console.log('Record updated successfully');

      this.isEditing = false;
      this.poultryIndex = null;
      this.isSavedArray[index] = true;


      this.showNotification = true;
      this.cd.detectChanges();

      setTimeout(() => {
        this.showNotification = false;
      }, 2000); 
    }, error => {
      console.error('Error updating record:', error);
    });
  }
  
  

  toggleModal() {
    this.isModalOpen = !this.isModalOpen; 
  }


  closeModal() {
    this.isModalOpen = false;
  }

 
  calculateAgeInDays(date: string): number {
    const hatchDate = new Date(date);
    const today = new Date();
    const differenceInTime = today.getTime() - hatchDate.getTime();
    return Math.floor(differenceInTime / (1000 * 3600 * 24)); 
  }

  calculateDescriptiveAge(date: string): string {
    const ageInDays = this.calculateAgeInDays(date);
    const daysInMonth = 30;
    const daysInWeek = 7;
    const months = Math.floor(ageInDays / daysInMonth);
    const remainingDays = ageInDays % daysInMonth; 
    const weeks = Math.floor(remainingDays / daysInWeek); 
    const days = remainingDays % daysInWeek; 
  
    let ageString = '';
    if (months > 0) ageString += `${months} month${months > 1 ? 's' : ''}`;
    if (weeks > 0) ageString += (ageString ? ', ' : '') + `${weeks} week${weeks > 1 ? 's' : ''}`;
    if (days > 0) ageString += (ageString ? ', ' : '') + `${days} day${days > 1 ? 's' : ''}`;
    

    return ageString || 'just hatched';
  }

  getFeedType(ageInDays: number): string {
    const ageInMonths = ageInDays / 30;
    if (ageInMonths < 2) return 'Chick Mash'; 
    if (ageInMonths >= 1 && ageInMonths < 2) return 'Starter Crumbles';
    if (ageInMonths >= 2 && ageInMonths < 4) return 'Growers Mash'; 
    if (ageInMonths >= 4) return 'Layers Mash'; 
    return 'The bird is old enough to sell out!';
  }

  addDays(date: string, days: number): string {
    const resultDate = new Date(date);
    resultDate.setDate(resultDate.getDate() + days);
    return resultDate.toISOString().split('T')[0]; 
  }

  getNextVaccine(age: number, hatchedDate: string): { vaccine: string, date: string } {
    if (age <= 7) return { vaccine: 'Newcastle 1st Dose', date: this.addDays(hatchedDate, 7) };
    if (age > 7 && age <= 14) return { vaccine: 'Newcastle 2nd Dose', date: this.addDays(hatchedDate, 14) };
    if (age > 14 && age <= 21) return { vaccine: 'Gumboro 1st Dose', date: this.addDays(hatchedDate, 21) };
    if (age > 21 && age <= 28) return { vaccine: 'Gumboro 2nd Dose', date: this.addDays(hatchedDate, 28) };
    if (age === 42) return { vaccine: 'Fowl Pox', date: this.addDays(hatchedDate, 42) };
    if (age === 56) return { vaccine: 'Fowl Typhoid', date: this.addDays(hatchedDate, 56) };
    if (age === 112) return { vaccine: 'Fowl Typhoid', date: this.addDays(hatchedDate, 112) };
    return { vaccine: 'Next dose coming soon', date: 'N/A' };
  }
 
  
  cancelEdit() {
    this.isEditing = false;
    this.poultryIndex = null;
  }
  
  reviewSoldBirds() {
    const soldBirds = this.birdRecords.filter(bird => bird.sold);
    console.log(soldBirds);
  }

  

  ngOnChanges(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.filterTerm.trim()) {
        this.filteredPoultryRecords = this.poultryTypes.filter(record =>
            record.birdType.toLowerCase().includes(this.filterTerm.toLowerCase())
        );
    } else {
        this.filteredPoultryRecords = [...this.poultryTypes]; 
    }
    this.calculateTotalPages();
}


  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredPoultryRecords.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = event.target.innerWidth >= 992;
    if (!this.isLargeScreen) {
      this.isSidebarOpen = false; 
    }
  } 

}