import { Component, OnInit } from '@angular/core';
import { MortalitiesService, Mortality } from '../services/mortalities.service';

@Component({
  selector: 'app-mortalities',
  templateUrl: './mortalities.component.html',
  styleUrls: ['./mortalities.component.css']
})
export class MortalitiesComponent implements OnInit {
  mortalities: Mortality[] = [];
  newMortality: Mortality = {
    id: 0,
    date: new Date(),
    numberOfMortalities: 0,
    reason: '',
    recordedBy: ''
  };
  
  isAddingNewMortality = false;
  isEditing = false;
  editingMortality: Mortality | null = null;
  addSuccess = false;  
  addError = false;  
  displayedMortalities: Mortality[] = []; 
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private mortalitiesService: MortalitiesService) {}

  ngOnInit(): void {
    this.fetchMortalities();
  }

  fetchMortalities() {
    this.mortalitiesService.getMortalities().subscribe(data => {
      this.mortalities = data.map(mortality => ({ ...mortality, visible: true }));
      this.updateDisplayedMortalities();
      this.sortMortalities();
    });
  }

get totalMortalities() {
  return this.mortalities.reduce((total,mortality)=>total+ mortality.numberOfMortalities,0)
}

sortMortalities(){
  this.mortalities.sort((a,b)=>new Date(b.date).getTime() - new Date(a.date).getTime())
}

  showAddMortalityForm() {
    this.isAddingNewMortality = true;
    this.isEditing = false;
    this.newMortality = { id: 0, date: new Date(), numberOfMortalities: 0, reason: '', recordedBy: '' }; 
  }

  addNewMortality() {
    const tempId = Date.now(); 
    const newRecord = { ...this.newMortality, id: tempId }; 
    this.mortalities.unshift(newRecord);
    this.mortalities.push(newRecord);
    this.isAddingNewMortality = false;

    this.mortalitiesService.addMortality(newRecord).subscribe(
      (response) => {
        const index = this.mortalities.findIndex(m => m.id === tempId);
        if (index !== -1) {
          this.mortalities[index] = response; 
          this.addSuccess = true; 
          this.resetMessageTimeout();
        }
        this.addError = false; 
      },
      error => {
        console.error('Error adding mortality:', error);
        this.mortalities.pop();
        this.addError = true;
        this.resetMessageTimeout();
        this.mortalities.shift();
      }
    );

    this.newMortality = {
      id: 0,
      date: new Date(),
      numberOfMortalities: 0,
      reason: '',
      recordedBy: ''
    };
  }

  resetMessageTimeout() {
    setTimeout(() => {
      this.addSuccess = false; 
      this.addError = false;   
    }, 5000); 
  }

  edit(mortality: Mortality) {
    this.isEditing = true;
    this.editingMortality = { ...mortality };
    this.isAddingNewMortality = false; 
  }

  saveEdit(updatedMortality: Mortality) {
    if (!this.editingMortality) return;

    const index = this.mortalities.findIndex(m => m.id === updatedMortality.id);
    if (index !== -1) {
      this.mortalities[index] = { ...updatedMortality, visible: this.mortalities[index].visible };
    }

    this.mortalitiesService.updateMortality(updatedMortality.id, updatedMortality).subscribe(
      () => {
        this.sortMortalities();
      this.updateDisplayedMortalities();
      },
      error => {
        console.error('Error updating mortality:', error);
        if (this.editingMortality) { 
          this.mortalities[index] = this.editingMortality; 
        }
      }
    );

    this.cancelEdit();
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingMortality = null;
  }

  delete(id: number) {
    const index = this.mortalities.findIndex(m => m.id === id);
    if (index !== -1) {
      const deletedMortality = this.mortalities[index];
      this.mortalities.splice(index, 1); 

      this.mortalitiesService.deleteMortality(id).subscribe(
        () => {},
        error => {
          console.error('Error deleting mortality:', error);
          this.mortalities.splice(index, 0, deletedMortality); 
        }
      );
    }
  }

  toggleVisibility(mortality: Mortality) {
    mortality.visible = !mortality.visible;
    this.mortalitiesService.updateMortality(mortality.id, mortality).subscribe(
      () => {},
      error => {
        console.error('Error updating visibility:', error);
        mortality.visible = !mortality.visible; 
      }
    );
  }

  updateDisplayedMortalities() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedMortalities = this.mortalities.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedMortalities();
  }

  getTotalPages() {
    return Math.ceil(this.mortalities.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updateDisplayedMortalities();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedMortalities();
    }
  }
}
