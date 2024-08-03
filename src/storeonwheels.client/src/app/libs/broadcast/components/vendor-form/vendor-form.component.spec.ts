import {
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
} from "@angular/core/testing";
import { VendorFormComponent } from "./vendor-form.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { VendorForm } from "~/app/libs/shared/models";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("VendorFormComponent", () => {
  let component: VendorFormComponent;
  let fixture: ComponentFixture<VendorFormComponent>;

  beforeEach(async () => {
    const formBuilder = new FormBuilder();
    const vendorForm: FormGroup<VendorForm> = formBuilder.nonNullable.group({
      id: ["", Validators.required],
      displayName: ["", Validators.required],
      description: ["", Validators.required],
    });

    await TestBed.configureTestingModule({
      imports: [VendorFormComponent, BrowserAnimationsModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorFormComponent);
    fixture.componentRef.setInput("vendorForm", vendorForm);
    fixture.autoDetectChanges();

    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("labels should exists", () => {
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root).toBeTruthy();

    const labels: HTMLLabelElement[] = Array.from(
      root.querySelectorAll("label")
    );
    expect(labels.length).toBe(2);
    expect(labels[0].innerText).toBe("Name");
    expect(labels[1].innerText).toBe("Description");
  });

  it("validation should work", async () => {
    const root: HTMLElement = fixture.nativeElement;
    expect(root).toBeTruthy();
    expect(component.vendorForm).toBeTruthy();

    component.vendorForm?.markAllAsTouched();
    fixture.detectChanges();
    expect(root.innerText).toContain("Name is required");
    expect(root.innerText).toContain("Description is required");

    const nameInput: HTMLInputElement | null = root.querySelector("input");
    expect(nameInput).not.toBeNull();

    if (nameInput == null) {
      return;
    }

    nameInput.value = "ABC";
    // Dispatch a DOM event so that Angular learns of input value change.
    nameInput.dispatchEvent(new Event("input"));
    // Wait for Angular to update the display binding
    await fixture.whenStable();

    expect(root.innerText).not.toContain("Name is required");
  });
});
