import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  WritableSignal,
  signal,
} from "@angular/core";
import { GeoInfo, Vendor } from "~/app/libs/shared/models";
import {
  HUB_CONNECTION,
  MessageHubService,
  TimeoutCache,
  hubConnection,
  CLICK_SUBJECT,
  ClickProps,
  clickSubject as _clickSubject,
} from "~/app/libs/map-page/services";
import { CommonModule } from "@angular/common";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { MatRow, MatTableModule } from "@angular/material/table";

@Component({
  selector: "app-vendor-table",
  standalone: true,
  imports: [CommonModule, MatTableModule],
  providers: [
    MessageHubService,
    { provide: HUB_CONNECTION, useValue: hubConnection },
    { provide: CLICK_SUBJECT, useValue: _clickSubject },
    { provide: TimeoutCache, useClass: TimeoutCache<string, Vendor> },
  ],

  templateUrl: "./vendor-table.component.html",
  styleUrl: "./vendor-table.component.css",
})
export class VendorTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) geoInfo$: Observable<GeoInfo> = new Observable();
  private geoSub: Subscription = new Subscription();
  private clickSub: Subscription = new Subscription();

  // The `{ read: ElementRef }` params is required, since MatRow is a Directive, and by default, a Directive will be returned.
  // https://github.com/angular/components/issues/17816#issue-528942343
  // https://tinyurl.com/4dxj78nk
  @ViewChildren(MatRow, { read: ElementRef }) tableRows: QueryList<
    ElementRef<HTMLTableRowElement>
  > = new QueryList();

  displayedColumns: string[] = ["displayName", "description"];
  vendors: WritableSignal<Vendor[]> = signal([]);

  constructor(
    @Inject(CLICK_SUBJECT) private clickSubject: BehaviorSubject<ClickProps>,
    @Inject(TimeoutCache) private vendorMap: TimeoutCache<string, Vendor>
  ) {}

  ngOnInit() {
    const { geoInfo$, vendorMap, vendors } = this;

    this.geoSub = geoInfo$.subscribe((info) => {
      const { vendor } = info;

      vendorMap.set(vendor.id, vendor);
      vendorMap.setTimer(vendor.id, Date.now() + 5000, () => {
        vendorMap.delete(vendor.id);
        vendors.set([...vendorMap.values()]);
      });

      vendors.set([...vendorMap.values()]);
    });
  }

  ngAfterViewInit() {
    this.clickSub = this.clickSubject.subscribe(({ vendorId, source }) =>
      this.scrollRowIntoView(vendorId, source)
    );
  }

  ngOnDestroy() {
    const { vendorMap } = this;
    vendorMap.dispose();
    this.geoSub.unsubscribe();
    this.clickSub.unsubscribe();
  }

  onRowClick(vendorId: string) {
    this.clickSubject.next({ vendorId, source: "VendorTableComponent" });
  }

  private scrollRowIntoView(vendorId: string, source: string) {
    const { tableRows } = this;
    const rows: HTMLTableRowElement[] = tableRows
      .toArray()
      .map((ref) => ref.nativeElement);

    const row: HTMLTableRowElement | undefined = rows.find(
      (r) => r.id == vendorId
    );
    if (row != null && source != "VendorTableComponent") {
      row.scrollIntoView();
    }
  }
}
