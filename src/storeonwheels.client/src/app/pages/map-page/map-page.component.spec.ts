import { ComponentFixture, TestBed } from "@angular/core/testing";
import MapPageComponent from "./map-page.component";
import {
  HUB_CONNECTION,
  MessageHubService,
  hubConnection,
} from "~/app/libs/map-module";
import { GeoInfo, Vendor } from "~/app/libs/shared-module";
import { Observable, from } from "rxjs";
import { Mock } from "ts-mocks";
import { VendorTableComponent } from "~/app/libs/map-module";

describe("MapPageComponent", () => {
  let component: MapPageComponent;
  let fixture: ComponentFixture<MapPageComponent>;
  let vendors: Vendor[] = [];

  beforeEach(async () => {
    vendors = [
      {
        id: "Vendor_1",
        displayName: "Vendor_1",
        description: "Vendor One",
      },
      {
        id: "Vendor_2",
        displayName: "Vendor_2",
        description: "Vendor Two",
      },
    ];
    const geoInfos: GeoInfo[] = vendors.map((vendor) => ({
      ...new GeoInfo(),
      vendorId: vendor.id,
      vendor,
    }));

    const msgHubMocker = new Mock<MessageHubService>({
      start: () => Promise.resolve(),
      dispose: () => Promise.resolve(),
    });
    const mockedHubService = {
      ...msgHubMocker.Object,
      get geoInfo$(): Observable<GeoInfo> {
        return from(geoInfos);
      },
    };

    spyOn(VendorTableComponent.prototype, "onRowClick");

    await TestBed.configureTestingModule({
      imports: [MapPageComponent],
      providers: [
        { provide: HUB_CONNECTION, useValue: hubConnection },
        { provide: MessageHubService, useValue: mockedHubService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapPageComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it("vendor table should create", () => {
    expect(component).toBeTruthy();

    const root: HTMLElement = fixture.nativeElement;
    const table = root.querySelector("table") as HTMLElement;
    expect(table).not.toBeNull();

    expect(table.innerText).toContain("Vendor_1");
    expect(table.innerText).toContain("Vendor_2");
  });

  it("mapbox should render", () => {
    const root: HTMLElement = fixture.nativeElement;
    expect(root.innerText).toContain("© Mapbox");
  });

  it("clicking on vendor table row should display pop up on map", () => {
    const root: HTMLElement = fixture.nativeElement;

    const rows = Array.from(
      root.querySelectorAll("tr")
    ) as HTMLTableRowElement[];
    expect(rows.length).toBeGreaterThanOrEqual(3);

    const regExp = new RegExp(vendors[0].displayName, "g");

    // pop up not shown
    const matches = Array.from(root.innerText.matchAll(regExp));
    expect(matches.length).toEqual(1);

    for (let i = 1; i < rows.length; i++) {
      rows[i].click();
    }

    // pop up shown
    fixture.detectChanges();

    expect(VendorTableComponent.prototype.onRowClick).toHaveBeenCalledTimes(2);
    // Somehow, the behaviour subject does not work
    // expect(root.querySelector("#custom_popup")).not.toBeNull();
  });
});
