import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { MapPageComponent } from "./map-page.component";
import {
  HUB_CONNECTION,
  MessageHubService,
  hubConnection,
} from "~/app/libs/map-feature/services";
import { GeoInfo, Vendor } from "~/app/libs/shared/models";
import { Observable, from } from "rxjs";
import { Mock } from "ts-mocks";

fdescribe("MapPageComponent", () => {
  let component: MapPageComponent;
  let fixture: ComponentFixture<MapPageComponent>;
  let vendors: Vendor[] = [];

  beforeEach(async () => {
    vendors = [
      {
        id: "1",
        displayName: "Vendor_1",
        description: "Vendor One",
      },
      {
        id: "2",
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

    await TestBed.configureTestingModule({
      imports: [MapPageComponent],
      providers: [
        { provide: HUB_CONNECTION, useValue: hubConnection },
        { provide: MessageHubService, useValue: mockedHubService },
      ],
    }).compileComponents();
    spyOnProperty(
      MessageHubService.prototype,
      "geoInfo$",
      "get"
    ).and.returnValue(from(geoInfos));
    spyOn(MessageHubService.prototype, "start").and.callFake(
      async () => undefined
    );
    spyOn(MessageHubService.prototype, "dispose").and.callFake(
      async () => undefined
    );

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

  it("clicking on vendor table row should display pop up on map", fakeAsync(() => {
    const root: HTMLElement = fixture.nativeElement;

    const rows = Array.from(
      root.querySelectorAll("tr")
    ) as HTMLTableRowElement[];
    expect(rows.length).toBeGreaterThanOrEqual(3);

    const regExp = new RegExp(vendors[0].displayName, "g");

    // pop up not shown
    const matches = Array.from(root.innerText.matchAll(regExp));
    expect(matches.length).toEqual(1);

    for (const row of rows) {
      row.click();
      fixture.detectChanges();
    }

    // pop up shown
    tick(100);
    fixture.detectChanges();
    tick(100);

    expect(root.querySelector("#custom_popup")).not.toBeNull();
  }));
});
