import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTableComponent } from './vendor-table.component';

describe('VendorTableComponent', () => {
  let component: VendorTableComponent;
  let fixture: ComponentFixture<VendorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
