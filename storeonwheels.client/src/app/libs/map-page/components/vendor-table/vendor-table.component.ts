import { Component, Inject, Input, OnInit, Signal, WritableSignal, computed, effect, signal } from '@angular/core';
import { Lru } from "toad-cache";
import { GeoInfo, Vendor } from '~/app/libs/shared/models';
import {
  HUB_CONNECTION,
  MessageHubService,
  hubConnection,
} from "~/app/libs/map-page/services";
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { CLICK_SUBJECT, clickSubject as _clickSubject } from '../../../shared/services';

@Component({
  selector: 'app-vendor-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  providers: [
    MessageHubService,
    { provide: HUB_CONNECTION, useValue: hubConnection },
    { provide: CLICK_SUBJECT, useValue: _clickSubject },
  ],

  templateUrl: './vendor-table.component.html',
  styleUrl: './vendor-table.component.css'
})
export class VendorTableComponent implements OnInit {
  @Input({ required: true }) geoInfo$: Subject<GeoInfo> = new Subject();

  private geoInfos = new Lru<GeoInfo>();
  displayedColumns: string[] = ['displayName', 'description'];
  private vendorMap: WritableSignal<Record<string, Vendor>> = signal({});
  vendors: Signal<Vendor[]> = computed(() => Object.values(this.vendorMap()));

  constructor(@Inject(CLICK_SUBJECT) private clickSubject: BehaviorSubject<string>) {
    effect(() => console.log({ vendors: this.vendors() }));
  }

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
    // this.clickSubject.next(vendorId);
  }

}
