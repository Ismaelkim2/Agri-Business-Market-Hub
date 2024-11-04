import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkersFormComponent } from './workers-form.component';

describe('WorkersFormComponent', () => {
  let component: WorkersFormComponent;
  let fixture: ComponentFixture<WorkersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkersFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
