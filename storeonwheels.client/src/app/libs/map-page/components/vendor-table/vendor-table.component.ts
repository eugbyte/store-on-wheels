import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  QueryList,
  Signal,
  ViewChildren,
  WritableSignal,
  computed,
  signal,
} from "@angular/core";
import { Lru } from "toad-cache";
import { GeoInfo, Vendor } from "~/app/libs/shared/models";
import {
  HUB_CONNECTION,
  MessageHubService,
  hubConnection,
} from "~/app/libs/map-page/services";
import { CommonModule } from "@angular/common";
import { BehaviorSubject, Subject } from "rxjs";
import { MatRow, MatTableModule } from "@angular/material/table";
import {
  CLICK_SUBJECT,
  ClickProps,
  clickSubject as _clickSubject,
} from "~/app/libs/shared/services";

@Component({
  selector: "app-vendor-table",
  standalone: true,
  imports: [CommonModule, MatTableModule],
  providers: [
    MessageHubService,
    { provide: HUB_CONNECTION, useValue: hubConnection },
    { provide: CLICK_SUBJECT, useValue: _clickSubject },
  ],

  templateUrl: "./vendor-table.component.html",
  styleUrl: "./vendor-table.component.css",
})
export class VendorTableComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) geoInfo$: Subject<GeoInfo> = new Subject();
  // The { read: ElementRef } params is required, since MatRow is a Directive, and by default, a Directive will be returned.
  // https://github.com/angular/components/issues/17816#issue-528942343
  // https://tinyurl.com/4dxj78nk
  @ViewChildren(MatRow, { read: ElementRef }) tableRows: QueryList<
    ElementRef<HTMLTableRowElement>
  > = new QueryList();

  private geoInfos = new Lru<GeoInfo>();
  displayedColumns: string[] = ["displayName", "description"];
  private vendorMap: WritableSignal<Record<string, Vendor>> = signal({});
  vendors: Signal<Vendor[]> = computed(() => Object.values(this.vendorMap()));

  constructor(
    @Inject(CLICK_SUBJECT) private clickSubject: BehaviorSubject<ClickProps>
  ) {}

  ngOnInit() {
    const { geoInfos, geoInfo$ } = this;
    geoInfo$.subscribe((info) => {
      geoInfos.set(info.vendorId, info);
      const { vendor } = info;

      this.vendorMap.update((prev) => {
        // current bug with angular signals that does not work with similar reference equality.
        // https://github.com/angular/angular/issues/53118#issuecomment-1823142151
        const copy: Record<string, Vendor> = { ...prev };
        copy[vendor.id] = vendor;
        return copy;
      });
    });
  }

  onRowClick(vendorId: string) {
    console.log({ vendorIdCicked: vendorId });
    this.clickSubject.next({ vendorId, source: "VendorTableComponent" });
  }

  ngAfterViewInit() {
    console.log("rerender");

    this.clickSubject.subscribe(({ vendorId, source }) => {
      const { tableRows } = this;
      const rows: HTMLTableRowElement[] = tableRows
        .toArray()
        .map((ref) => ref.nativeElement);
      console.log({ vendorId, source });

      const row: HTMLTableRowElement | undefined = rows.find(
        (r) => r.id == vendorId
      );
      if (row != null && source != "VendorTableComponent") {
        row.scrollIntoView();
      }
    });
  }
}
