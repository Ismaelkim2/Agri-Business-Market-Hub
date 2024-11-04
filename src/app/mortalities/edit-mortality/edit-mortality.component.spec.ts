import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMortalityComponent } from './edit-mortality.component';

describe('EditMortalityComponent', () => {
  let component: EditMortalityComponent;
  let fixture: ComponentFixture<EditMortalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMortalityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMortalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
