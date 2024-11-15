import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EggsRecordFormComponent } from './eggs-record-form.component';

describe('EggsRecordFormComponent', () => {
  let component: EggsRecordFormComponent;
  let fixture: ComponentFixture<EggsRecordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EggsRecordFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EggsRecordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
