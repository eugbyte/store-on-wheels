import { Component, OnInit, OnDestroy } from "@angular/core";
import { GeolocateService } from "~/app/libs/broadcast-page/services";
import { MessageHubService, hubConnection } from "~/app/libs/map-page/services";
import { GeoInfo, Vendor, VendorForm } from "~/app/libs/shared/models";
import { Observable } from "rxjs";
import { VendorService } from "~/app/libs/broadcast-page/services";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { VendorFormComponent } from "~/app/libs/broadcast-page/components";

@Component({
  selector: "app-broadcast-page",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    VendorFormComponent,
  ],
  templateUrl: "./broadcast-page.component.html",
  styleUrl: "./broadcast-page.component.css",
})
export class BroadcastPageComponent implements OnInit, OnDestroy {
  private canBroadcast = false;
  private position$: Observable<GeolocationPosition> = new Observable();
  steps: boolean[] = [false, false];

  vendorForm: FormGroup<VendorForm> = this.formBuilder.nonNullable.group({
    id: ["", Validators.required],
    displayName: ["", Validators.required],
    description: ["", Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private geoService: GeolocateService,
    private messageHub: MessageHubService,
    private vendorService: VendorService
  ) {
    this.position$ = geoService.position$;
  }

  async ngOnInit() {
    await this.messageHub.start();
    this.vendorForm.patchValue({ id: hubConnection.connectionId ?? "" });

    this.position$.subscribe((position: GeolocationPosition) => {
      if (!this.canBroadcast) {
        return;
      }

      const geoInfo = new GeoInfo();
      geoInfo.coords = position.coords;
      geoInfo.timestamp = Date.now();

      const vendorId: string = hubConnection.connectionId ?? "";
      this.messageHub.sendGeoInfo(vendorId, geoInfo);
    });
  }

  toggleBroadcast() {
    this.canBroadcast = !this.canBroadcast;

    if (!this.canBroadcast) {
      this.geoService.stopWatch();
    } else {
      this.geoService.watchPosition(5000);
    }
  }

  async onSubmit(vendor: Vendor) {
    console.log("parent");
    console.log(vendor);
  }

  ngOnDestroy() {
    this.geoService.dispose();
  }
}
