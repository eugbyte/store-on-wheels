import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GeoPermissionInstructionComponent } from "./geo-permission-instruction.component";

describe("GeoPermissionComponent", () => {
  let component: GeoPermissionInstructionComponent;
  let fixture: ComponentFixture<GeoPermissionInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoPermissionInstructionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeoPermissionInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
