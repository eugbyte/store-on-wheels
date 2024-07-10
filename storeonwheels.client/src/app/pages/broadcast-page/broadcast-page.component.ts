import { CommonModule } from "@angular/common";
import { Component, OnInit, Signal, ViewChild, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { Observable } from "rxjs";
import {
  GeoPermissionComponent,
  VendorFormComponent,
} from "~/app/libs/broadcast-page/components";
import {
  GeolocateService,
  VendorService,
} from "~/app/libs/broadcast-page/services";
import {
  MessageHubService,
  WsState,
  hubConnection,
} from "~/app/libs/map-page/services";
import { GeoInfo, Vendor, VendorForm } from "~/app/libs/shared/models";
import { SleepService } from "~/app/libs/shared/services";

@Component({
  selector: "app-broadcast-page",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    VendorFormComponent,
    MatSlideToggleModule,
    GeoPermissionComponent,
  ],
  templateUrl: "./broadcast-page.component.html",
  styleUrl: "./broadcast-page.component.css",
})
export class BroadcastPageComponent implements OnInit {
  private position$: Observable<GeolocationPosition> = new Observable();
  private posError$: Observable<GeolocationPositionError> = new Observable();

  // 1. Create Vendor.
  @ViewChild("stepper", { read: MatStepper }) stepper?: MatStepper;
  isLinear = false;
  vendorBtnText = signal("Next");
  vendorBtnEnabled = signal(true);

  // 2. Grant geo watch permission and start geo watch.
  vendorForm: FormGroup<VendorForm> = this.formBuilder.nonNullable.group({
    id: ["", Validators.required],
    displayName: ["", Validators.required],
    description: ["", Validators.required],
  });
  geoPermissionState = signal<PermissionState>("denied");
  posError: Signal<GeolocationPositionError | undefined> = signal(undefined);

  // 3. Broadcast toggle.
  canBroadcast = signal(false);
  toggleTexts: Record<string, string> = {
    true: "Broadcasting...",
    false: "Broadcast stopped",
  };

  constructor(
    private formBuilder: FormBuilder,
    private geoService: GeolocateService,
    private messageHub: MessageHubService,
    private vendorService: VendorService,
    private sleepService: SleepService
  ) {
    this.position$ = geoService.position$;
    this.posError$ = geoService.error$;
    this.posError = toSignal(this.posError$);
  }

  async ngOnInit() {
    this.messageHub.state$.subscribe((state: WsState) =>
      this.vendorForm.patchValue({ id: state.connectionId ?? "" })
    );

    this.position$.subscribe((position) => {
      console.log(position);
      const geoInfo = new GeoInfo();
      geoInfo.coords = position.coords;
      geoInfo.timestamp = Date.now();

      const vendorId: string = hubConnection.connectionId ?? "";
      this.messageHub.sendGeoInfo(vendorId, geoInfo);
    });

    this.posError$.subscribe(((err) => {
      console.log(err);
    }));

    const permission: PermissionState =
      await this.geoService.getPermPermissionState();
    this.geoPermissionState.set(permission);
    console.log({ permission });
  }

  // 1. Create Vendor.
  async submitVendor() {
    const {
      vendorForm,
      stepper,
      vendorService,
      vendorBtnEnabled,
      vendorBtnText,
      sleepService,
    } = this;
    if (!vendorBtnEnabled()) {
      return;
    }

    vendorForm.markAllAsTouched();
    const isValid = vendorForm.valid && stepper != null;
    if (!isValid) {
      return;
    }

    const vendor = vendorForm.value as Vendor;
    try {
      vendorBtnText.set("Loading...");
      vendorBtnEnabled.set(false);
      await vendorService.createVendor(vendor);
      console.log("created");

      stepper.next();
    } catch (error) {
      console.error(error);

      vendorBtnText.set("Something went wrong");
      await sleepService.sleep(2000);

      vendorBtnEnabled.set(true);
      vendorBtnText.set("Next");
    }
  }

  // 2. Grant geo watch permission and start geo watch.
  async grantWatchPermission() {
    const err: GeolocationPositionError | null =
      await this.geoService.watchPosition({
        enableHighAccuracy: false,
        timeout: 20_000,
        maximumAge: 60_000,        
      });
    this.canBroadcast.set(err == null);    
  }

  // 3. Broadcast toggle.
  toggleBroadcast() {
    const { canBroadcast, geoService } = this;
    console.log({ canBroadcast: canBroadcast() });
    if (!canBroadcast()) {
      geoService.stopWatch();
    } else {
      geoService.watchPosition();
    }
  }
}
