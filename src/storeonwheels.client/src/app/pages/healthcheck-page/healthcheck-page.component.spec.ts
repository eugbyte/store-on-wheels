import { ComponentFixture, TestBed } from "@angular/core/testing";
import axios from "axios";
import HealthcheckPageComponent from "./healthcheck-page.component";
import {
  HUB_CONNECTION,
  MessageHubService,
  hubConnection,
} from "~/app/libs/map-feature/services";

describe("HealthcheckComponent", () => {
  let component: HealthcheckPageComponent;
  let fixture: ComponentFixture<HealthcheckPageComponent>;

  beforeEach(async () => {
    const data: Record<string, string> = { message: "Server is running" };
    spyOn(axios, "get").and.resolveTo({ data });

    await TestBed.configureTestingModule({
      imports: [HealthcheckPageComponent],
      providers: [
        { provide: HUB_CONNECTION, useValue: hubConnection },
        MessageHubService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthcheckPageComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it("should create", () => expect(component).toBeTruthy());

  it("should display health status", async () => {
    const root: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    expect(root.innerText).toContain("Server is running");
  });
});
