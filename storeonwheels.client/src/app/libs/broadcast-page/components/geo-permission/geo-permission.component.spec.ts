import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GeoPermissionComponent } from "./geo-permission.component";

describe("GeoPermissionComponent", () => {
  let component: GeoPermissionComponent;
  let fixture: ComponentFixture<GeoPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoPermissionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeoPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
