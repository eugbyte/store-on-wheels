import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MapComponent } from "./map.component";

describe("MapComponent", () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("mapbox should render", () => {
    expect(component).toBeTruthy();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.innerText).toContain("© Mapbox");
  });
});
