import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BroadcastPageComponent } from "./broadcast-page.component";

describe("BroadcastPageComponent", () => {
  let component: BroadcastPageComponent;
  let fixture: ComponentFixture<BroadcastPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BroadcastPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BroadcastPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
