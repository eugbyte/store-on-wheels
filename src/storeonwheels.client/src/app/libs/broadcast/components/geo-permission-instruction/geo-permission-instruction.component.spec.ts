import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GeoPermissionInstructionComponent } from "./geo-permission-instruction.component";

describe("GeoPermissionComponent", () => {
  let component: GeoPermissionInstructionComponent;
  let fixture: ComponentFixture<GeoPermissionInstructionComponent>;
  const instructions: RegExp =
    /To modify permission, click the map marker icon at the address bar/i;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoPermissionInstructionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeoPermissionInstructionComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it("prompt geoPermission should not show instructions", async () => {
    expect(component).toBeTruthy();
    fixture.componentRef.setInput("geoPermission", "prompt");
    await fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.innerText).not.toMatch(instructions);
  });

  it("granted geoPermission should show instructions", () => {
    expect(component).toBeTruthy();
    fixture.componentRef.setInput("geoPermission", "granted");
    const root: HTMLElement = fixture.nativeElement;
    expect(root.innerText).toMatch(instructions);
  });
});
