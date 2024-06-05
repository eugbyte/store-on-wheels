import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterNavComponent } from './footer-nav.component';

describe('FooterNavComponent', () => {
  let component: FooterNavComponent;
  let fixture: ComponentFixture<FooterNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FooterNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
