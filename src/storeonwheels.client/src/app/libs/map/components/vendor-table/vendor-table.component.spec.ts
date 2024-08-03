import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VendorTableComponent } from "./vendor-table.component";
import { Vendor } from "~/app/libs/shared/models";
import { Observable, of } from "rxjs";

describe("VendorTableComponent", () => {
  let component: VendorTableComponent;
  let fixture: ComponentFixture<VendorTableComponent>;

  beforeEach(async () => {
    const vendor1: Vendor = {
      id: "1",
      displayName: "Vendor_1",
      description: "Vendor One"
    };
    const vendor2: Vendor = {
      id: "2",
      displayName: "Vendor_2",
      description: "Vendor Two"
    }

    const vendors$: Observable<Vendor> = of(vendor1, vendor2);

    await TestBed.configureTestingModule({
      imports: [VendorTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("vendor$", vendors$);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();

    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll("tr").length).toBe(2);
  });
});
