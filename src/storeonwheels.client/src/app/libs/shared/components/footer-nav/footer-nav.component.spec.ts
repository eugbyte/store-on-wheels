import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FooterNavComponent } from "./footer-nav.component";
import { RouterModule } from "@angular/router";

describe("FooterNavComponent", () => {
  let component: FooterNavComponent;
  let fixture: ComponentFixture<FooterNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterNavComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();

    const root: HTMLElement = fixture.nativeElement;
    expect(root.innerText).toMatch(/map/i);
    expect(root.innerText).toMatch(/broadcast/i);
  });
});
