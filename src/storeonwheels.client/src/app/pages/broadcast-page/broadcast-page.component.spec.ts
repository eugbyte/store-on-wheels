import { ComponentFixture, TestBed } from "@angular/core/testing";
import BroadcastPageComponent from "./broadcast-page.component";
import axios from "axios";
import { HUB_CONNECTION, hubConnection } from "~/app/libs/map-module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("BroadcastPageComponent", () => {
  let component: BroadcastPageComponent;
  let fixture: ComponentFixture<BroadcastPageComponent>;

  beforeEach(async () => {
    spyOn(axios, "post").and.resolveTo({ data: {} });

    await TestBed.configureTestingModule({
      imports: [BroadcastPageComponent, BrowserAnimationsModule],
      providers: [{ provide: HUB_CONNECTION, useValue: hubConnection }],
    }).compileComponents();

    fixture = TestBed.createComponent(BroadcastPageComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it("form stepper should progress", async () => {
    const root: HTMLElement = fixture.nativeElement;
    expect(component.vendorForm).toBeTruthy();

    fixture.detectChanges();
    const nameInput = Array.from(root.querySelectorAll("input")).find(
      (el) =>
        el.attributes.getNamedItem("formcontrolname")?.value == "displayName"
    ) as HTMLInputElement;
    const descriptionInput = Array.from(root.querySelectorAll("input")).find(
      (el) =>
        el.attributes.getNamedItem("formcontrolname")?.value == "description"
    ) as HTMLInputElement;
    expect(nameInput).not.toBeNull();
    expect(descriptionInput).not.toBeNull();

    // Dispatch a DOM event so that Angular learns of input value change.
    // Wait for Angular to update the display binding
    nameInput.value = "MOCK_NAME";
    nameInput.dispatchEvent(new Event("input"));
    descriptionInput.value = "MOCK_VALUE";
    descriptionInput.dispatchEvent(new Event("input"));

    await fixture.whenStable();

    const button = Array.from(root.querySelectorAll("button")).find((el) =>
      el.innerText.includes("Next")
    ) as HTMLInputElement;
    expect(button).not.toBeNull();
    button.click();

    await fixture.whenStable();

    // Second step reached
    expect(root.innerText).toContain("Reset");
  });
});
