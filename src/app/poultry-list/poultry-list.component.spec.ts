import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoultryListComponent } from './poultry-list.component';

describe('PoultryListComponent', () => {
  let component: PoultryListComponent;
  let fixture: ComponentFixture<PoultryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoultryListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoultryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
