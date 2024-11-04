// import { Injectable } from '@angular/core';
// import { BehaviorSubject, map, Observable, of } from 'rxjs';



//  export  interface DailyRecord {
//   date: string;
//   count: number;
//   eggProduction: number;
//   feedConsumption: number;
//   vaccineRecords: { vaccine: string; date: string}[]; 
//   hatchDate: string;
//   totalBirds: number;   
//   newFlock: number;     
//   mortalities: number; 
//   hatchdata: string;  
//   birdType: string;    
//   birdCount: number; 
//   sales: number;
//   expenses: number;
  
// }

// @Injectable({
//   providedIn: 'root'
// })

// export class FarmDataService {
//   private birdRecordsSubject = new BehaviorSubject<BirdRecord[]>(this.loadBirdRecords());
//   birdRecords$ = this.birdRecordsSubject.asObservable();

//   private weeklySummarySubject = new BehaviorSubject<WeeklySummary[]>(this.loadWeeklySummary());
//   weeklySummary$ = this.weeklySummarySubject.asObservable();

//   private dailyRecordsSubject = new BehaviorSubject<DailyRecord[]>(this.loadDailyRecords());
//   dailyRecords$ = this.dailyRecordsSubject.asObservable();

//   private workersSubject = new BehaviorSubject<Worker[]>(this.loadWorkers());
//   workers$ = this.workersSubject.asObservable();

//   private vaccinationRecordsSubject = new BehaviorSubject<VaccineRecord[]>(this.loadVaccinationRecords());
//   vaccinationRecords$ = this.vaccinationRecordsSubject.asObservable();


//   private loadWorkers(): Worker[] {
//     const storedWorkers = localStorage.getItem('workers');
//     return storedWorkers ? JSON.parse(storedWorkers) : [];
//   }

//    saveWorker(worker: Worker): Observable<void> {
//     const currentWorkers = this.workersSubject.value;
//     currentWorkers.push(worker);
//     this.workersSubject.next(currentWorkers);
//     localStorage.setItem('workers', JSON.stringify(currentWorkers));
//     return of();
//   }


//   updateWorker(updatedWorker: Worker, index: number): Observable<void> {
//     const currentWorkers = this.workersSubject.value;
//     currentWorkers[index] = updatedWorker; 
//     this.workersSubject.next(currentWorkers); 
//     localStorage.setItem('workers', JSON.stringify(currentWorkers)); 

//     return of(undefined); 
//   }

//   deleteWorker(index: number): Observable<void> {
//     const currentWorkers = this.workersSubject.value;
//     currentWorkers.splice(index, 1);
//     this.workersSubject.next(currentWorkers);
//     localStorage.setItem('workers', JSON.stringify(currentWorkers));
//     return of();
//   }

//   getTotalWorkers(): Observable<number> {
//     return this.workers$.pipe(map(workers => workers.length));
//   }

//   getWorkerRoles(): Observable<string[]> {
//     return this.workers$.pipe(map(workers => workers.map(worker => worker.role)));
//   }

  
//    setBirdRecords(records: BirdRecord[]) {
//     this.birdRecordsSubject.next(records);
//   }


//   setWeeklySummary(summary: WeeklySummary[]) {
//     this.weeklySummarySubject.next(summary);
//   }

//   constructor() {
//     if (this.weeklySummarySubject.value.length === 0) {
//       this.generateWeeklySummary();
//     }
//   }

//   saveBirdRecord(record: BirdRecord): Observable<void> {
//     const currentRecords = this.birdRecordsSubject.value;
//     currentRecords.push(record);
//     this.birdRecordsSubject.next(currentRecords);
//     localStorage.setItem('birdRecords', JSON.stringify(currentRecords));
//     this.generateWeeklySummary();
//     return of(); 
//   }

//   updateBirdRecord(updatedRecord: BirdRecord): Observable<void> {
//     const currentRecords = this.birdRecordsSubject.value;
//     const index = currentRecords.findIndex(record => record.date === updatedRecord.date && record.birdType === updatedRecord.birdType);
//     if (index > -1) {
//       currentRecords[index] = updatedRecord;
//       this.birdRecordsSubject.next(currentRecords);
//       localStorage.setItem('birdRecords', JSON.stringify(currentRecords));
//       this.generateWeeklySummary();
//     }
//     return of();
//   }

//   deleteDailyRecord(date: string): Observable<void> {
//     const currentRecords = this.dailyRecordsSubject.value;
//     const updatedRecords = currentRecords.filter(record => record.date !== date);
//     this.dailyRecordsSubject.next(updatedRecords);
//     localStorage.setItem('dailyRecords', JSON.stringify(updatedRecords));
//     this.generateWeeklySummary();
    
//     return of(); 
//   }

//   deleteSale(saleId: number): Observable<void> {
//     const currentRecords = this.dailyRecordsSubject.value;
//     const updatedRecords = currentRecords.map(record => {
//       if (record.sales === saleId) {
//         return { ...record, sales: 0 };
//       }
//       return record;
//     });
//     this.dailyRecordsSubject.next(updatedRecords);
//     localStorage.setItem('dailyRecords', JSON.stringify(updatedRecords));
//     this.generateWeeklySummary();
//     return of();
//   }

//   deleteBirdRecord(birdRecord: BirdRecord): Observable<void> {
//     const currentRecords = this.birdRecordsSubject.value;
//     const updatedRecords = currentRecords.filter(record => record.date !== birdRecord.date || record.birdType !== birdRecord.birdType);
//     this.birdRecordsSubject.next(updatedRecords);
//     localStorage.setItem('birdRecords', JSON.stringify(updatedRecords));
//     return of();
//   }
  

//   saveDailyRecord(record: DailyRecord): Observable<void> {
//     const currentRecords = this.dailyRecordsSubject.value;
//     const existingRecordIndex = currentRecords.findIndex(r => r.date === record.date && r.birdType === record.birdType);
    
//     if (existingRecordIndex > -1) {
//       currentRecords[existingRecordIndex] = record;
//     } else {
//       currentRecords.push(record);
//     }

//     this.dailyRecordsSubject.next(currentRecords);  
//     localStorage.setItem('dailyRecords', JSON.stringify(currentRecords));

//     this.generateWeeklySummary();
    
//     return of();
//   }

//   updateDailyRecord(date: string, updatedRecord: DailyRecord): Observable<void> {
//     const currentRecords = this.dailyRecordsSubject.value;
//     const recordIndex = currentRecords.findIndex(record => record.date === date);
//     if (recordIndex > -1) {
//       currentRecords[recordIndex] = updatedRecord;
//       this.dailyRecordsSubject.next([...currentRecords]);
//       localStorage.setItem('dailyRecords', JSON.stringify(currentRecords));
//       this.generateWeeklySummary();
//     }
//     return of();
//   }

//   private loadBirdRecords(): BirdRecord[] {
//     const storedRecords = localStorage.getItem('birdRecords');
//     return storedRecords ? JSON.parse(storedRecords) : [];
//   }
  
//   private loadWeeklySummary(): WeeklySummary[] {
//     const storedSummary = localStorage.getItem('weeklySummary');
//     return storedSummary ? JSON.parse(storedSummary) : [];
//   }
  
//   private loadDailyRecords(): DailyRecord[] {
//     return JSON.parse(localStorage.getItem('dailyRecords') || '[]');
//   }

//   saveWeeklySummary(summary: WeeklySummary): Observable<void> {
//     const currentSummaries = this.weeklySummarySubject.value;
//     currentSummaries.push(summary);
//     this.weeklySummarySubject.next(currentSummaries);
//     localStorage.setItem('weeklySummary', JSON.stringify(currentSummaries));
//     return of();
//   }

//   updateWeeklySummary(updatedSummary: WeeklySummary): Observable<void> {
//     const currentSummaries = this.weeklySummarySubject.value;
//     const index = currentSummaries.findIndex(summary => summary.week === updatedSummary.week);
//     if (index > -1) {
//       currentSummaries[index] = updatedSummary;
//       this.weeklySummarySubject.next(currentSummaries);
//       localStorage.setItem('weeklySummary', JSON.stringify(currentSummaries));
//     }
//     return of(); 
//   }
  
//   private generateWeeklySummary() {
//     const dailyRecords = this.dailyRecordsSubject.value;
//     const newWeeklySummary: WeeklySummary[] = [];

//     // Group daily records by week
//     const groupedByWeek = dailyRecords.reduce((acc, record) => {
//         const week = this.getWeekFromDate(record.date);
//         if (!acc[week]) acc[week] = { week, totalBirds: 0, newFlock: 0, mortalities: 0, eggProduction: 0, feedConsumption: 0,vaccineRecords:0,sales:0,expenses: 0,
//           profit: 0  };
//         acc[week].totalBirds += record.birdCount;
//         acc[week].newFlock += record.newFlock;
//         acc[week].mortalities += record.mortalities;
//         acc[week].eggProduction += record.eggProduction;
//         acc[week].feedConsumption += record.feedConsumption;
//         acc[week].expenses+=record.expenses
//         acc[week].sales+=record.sales;
//         acc[week].profit = acc[week].sales - acc[week].expenses;

        
        
//         return acc;
//     }, {} as { [key: string]: WeeklySummary });

   
//     for (const week in groupedByWeek) {
//         if (groupedByWeek.hasOwnProperty(week)) {
//             newWeeklySummary.push(groupedByWeek[week]);
//         }
//     }

  
//     this.weeklySummarySubject.next(newWeeklySummary);


//     localStorage.setItem('weeklySummary', JSON.stringify(newWeeklySummary));
// }

//   private getWeekFromDate(date: string): string {
//     const givenDate = new Date(date);
//     const startOfYear = new Date(givenDate.getFullYear(), 0, 1);
//     const days = Math.floor((givenDate.valueOf() - startOfYear.valueOf()) / (24 * 60 * 60 * 1000));
//     const weekNumber = Math.ceil((givenDate.getDay() + 1 + days) / 7);

//     return `Week ${weekNumber}`;
//   }

//   getTotalBirds(): Observable<number> {
//     return this.birdRecords$.pipe(
//       map(records => 
//         records.reduce((total, record) => total + (record.count || 0), 0)
//       )
//     );
//   }

//   private loadVaccinationRecords(): VaccineRecord[] {
//     const storedRecords = localStorage.getItem('vaccinationRecords');
//     return storedRecords ? JSON.parse(storedRecords) : [];
//   }
//   getVaccinationRecords(): Observable<VaccineRecord[]> {
//     return this.vaccinationRecords$;
//   }


//   getMonthlySales(month: number, year: number): Observable<number> {
//     return this.birdRecords$.pipe(
//       map(records =>
//         records
//           .filter(record => {
//             const recordDate = new Date(record.date);
//             return recordDate.getMonth() === month && recordDate.getFullYear() === year;
//           })
//           .reduce((totalSales, record) => totalSales + (record.sales || 0), 0)
//       )
//     );
//   }

//   getMonthlyExpenses(month: number, year: number): Observable<number> {
//     return this.birdRecords$.pipe(
//       map(records =>
//         records
//           .filter(record => {
//             const recordDate = new Date(record.date);
//             return recordDate.getMonth() === month && recordDate.getFullYear() === year;
//           })
//           .reduce((totalExpenses, record) => totalExpenses + (record.expenses || 0), 0)
//       )
//     );
//   }
// }