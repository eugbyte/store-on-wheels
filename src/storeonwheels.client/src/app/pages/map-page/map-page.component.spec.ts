import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MapPageComponent } from "./map-page.component";
import {
  HUB_CONNECTION,
  MessageHubService,
  hubConnection,
} from "~/app/libs/map/services";
import { GeoInfo, Vendor } from "~/app/libs/shared/models";
import { Observable, from } from "rxjs";
import { Mock } from "ts-mocks";
import { SleepService } from "~/app/libs/shared/services";

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

  it("clicking on vendor table row should display pop up on map", async () => {
    const root: HTMLElement = fixture.nativeElement;

    const rows = Array.from(
      root.querySelectorAll("tr")
    ) as HTMLTableRowElement[];
    expect(rows.length).toBeGreaterThanOrEqual(2);

    // the first row is the header row
    rows.shift();

    const regExp = new RegExp(vendors[0].displayName, "g");

    // pop up not shown
    let matches = Array.from(root.innerText.matchAll(regExp));
    expect(matches.length).toEqual(1);

    rows[0].click();
    console.log(rows[0]);
    fixture.detectChanges();

    // pop up shown
    fixture.detectChanges();
    const sleeper = new SleepService();
    await sleeper.sleep(3000);

    matches = Array.from(root.innerText.matchAll(regExp));
    expect(matches.length).toEqual(2);
  });
});
