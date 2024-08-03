import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VendorTableComponent } from "./vendor-table.component";
import { Vendor } from "~/app/libs/shared/models";
import { Observable, from } from "rxjs";

describe("VendorTableComponent", () => {
  let component: VendorTableComponent;
  let fixture: ComponentFixture<VendorTableComponent>;
  let vendors: Vendor[];

  beforeEach(async () => {
    const vendor1: Vendor = {
      id: "1",
      displayName: "Vendor_1",
      description: "Vendor One",
    };
    const vendor2: Vendor = {
      id: "2",
      displayName: "Vendor_2",
      description: "Vendor Two",
    };
    vendors = [vendor1, vendor2];
    const vendors$: Observable<Vendor> = from(vendors);

    await TestBed.configureTestingModule({
      imports: [VendorTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("vendor$", vendors$);
    fixture.autoDetectChanges();
  });

  it("table rows should be rendered", () => {
    expect(component).toBeTruthy();

    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll("tr").length).toBe(vendors.length + 1);

    const table = root.querySelector("table") as HTMLElement;
    expect(table).not.toBeNull();

    expect(table.innerText).toContain("Vendor_1");
    expect(table.innerText).toContain("Vendor_2");
  });
});
