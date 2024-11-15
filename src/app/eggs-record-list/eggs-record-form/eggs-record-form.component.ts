import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EggsRecordService } from '../../services/eggsRecord.service';


@Component({
  selector: 'app-eggs-record-form',
  templateUrl: './eggs-record-form.component.html',
  styleUrls: ['./eggs-record-form.component.css']
})
export class EggsRecordFormComponent implements OnInit {
  record = { date: '', eggCount: 0, broken: 0, recordedBy: '' };
  isEdit = false;

  constructor(
    private eggsrecordService: EggsRecordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.eggsrecordService.getRecordById(id).subscribe((data) => {
        this.record = data;
      });
    }
  }

  saveRecord(): void {
    if (this.isEdit) {
      this.eggsrecordService.updateRecord(this.record).subscribe(() =>
         this.router.navigate(['/eggs-record-list']));
    

    } else {
      this.eggsrecordService.createRecord(this.record).subscribe(() => 
        this.router.navigate(['/eggs-record-list']));

    }
  }
}
