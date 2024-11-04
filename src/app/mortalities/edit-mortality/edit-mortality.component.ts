import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Mortality } from '../../services/mortalities.service';

@Component({
  selector: 'app-edit-mortality',
  templateUrl: './edit-mortality.component.html',
  styleUrls: ['./edit-mortality.component.css']
})
export class EditMortalityComponent {
  @Input() mortality!: Mortality;
  @Output() save = new EventEmitter<Mortality>();
  @Output() cancel = new EventEmitter<void>();

  onSave() {
    this.save.emit(this.mortality);
  }

  onCancel() {
    this.cancel.emit();
  }
}
