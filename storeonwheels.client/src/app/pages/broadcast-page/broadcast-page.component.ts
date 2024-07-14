import { CommonModule } from "@angular/common";
import {
  Component,
  OnDestroy,
  OnInit,
  Signal,
  ViewChild,
  WritableSignal,
  signal,
} from "@angular/core";
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
import { MatDividerModule } from "@angular/material/divider";
import { Observable } from "rxjs";
import {
  GeoPermissionInstructionComponent,
  VendorFormComponent,
} from "~/app/libs/broadcast-page/components";
import {
  GeoPermission,
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
import { toSignal } from "@angular/core/rxjs-interop";

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
    GeoPermissionInstructionComponent,
    MatDividerModule,
  ],
  templateUrl: "./broadcast-page.component.html",
  styleUrl: "./broadcast-page.component.css",
})
export class BroadcastPageComponent implements OnInit, OnDestroy {
  private position$: Observable<GeolocationPosition> = new Observable();
  posError: Signal<GeolocationPositionError | undefined> = signal(undefined);
  coordinates: WritableSignal<GeolocationCoordinates | undefined> =
    signal(undefined);

  // 1. Create Vendor.
  @ViewChild("stepper", { read: MatStepper }) stepper?: MatStepper;
  isLinear = true;
  vendorBtnText = signal("Next");
  vendorBtnEnabled = signal(true);

  vendorForm: FormGroup<VendorForm> = this.formBuilder.nonNullable.group({
    id: ["", Validators.required],
    displayName: ["", Validators.required],
    description: ["", Validators.required],
  });

  // 2. Broadcast toggle.
  geoPermission = signal<GeoPermission>("denied");
  broadcastOn = signal(false);
  toggleTexts = new Map<boolean, string>([
    [true, "Broadcasting"],
    [false, "Broadcast stopped"],
  ]);

  constructor(
    private formBuilder: FormBuilder,
    private geoService: GeolocateService,
    private messageHub: MessageHubService,
    private vendorService: VendorService,
    private sleepService: SleepService
  ) {
    this.position$ = geoService.position$;
    this.posError = toSignal(geoService.error$);
  }

  async ngOnInit() {
    this.messageHub.state$.subscribe((state: WsState) =>
      this.vendorForm.patchValue({ id: state.connectionId ?? "" })
    );

    this.position$.subscribe((position) => {
      console.log(position);
      const geoInfo = new GeoInfo();
      const { coords } = position;
      geoInfo.coords = coords;
      geoInfo.timestamp = Date.now();

      const vendorId: string = hubConnection.connectionId ?? "";
      this.messageHub.sendGeoInfo(vendorId, geoInfo);

      this.coordinates.set(coords);
    });

    const permission: PermissionState =
      await this.geoService.getPermanentPermission();
    console.log({ permission });
    this.geoPermission.set(permission);
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

  // 2. Broadcast toggle.
  async toggleBroadcast() {
    const { broadcastOn, geoService, geoPermission } = this;
    if (!broadcastOn()) {
      geoService.stopWatch();
      // note that permanent permission != temporary permission
      // e..g, user might have granted permanent permission, but decide to turn off geoWatch
      const permanentPerm: PermissionState =
        await geoService.getPermanentPermission();
      geoPermission.set(permanentPerm);
      return;
    }

    // user has 4 choices w.r.t geo permission
    // allow permenanet, allow temp, ban permenanent, ban temp
    // if temporary decision is made, getPermanentPermission() will still return "prompt" regardless.
    const error: GeolocationPositionError | null =
      await geoService.watchPosition();
    const permanentPermission: PermissionState =
      await geoService.getPermanentPermission();
    console.log({ error, permanentPermission });

    if (permanentPermission == "granted") {
      geoPermission.set("granted");
    } else if (permanentPermission == "denied") {
      geoPermission.set("denied");
      broadcastOn.set(false);
    } else if (
      error != null &&
      error.code == GeolocationPositionError.PERMISSION_DENIED
    ) {
      geoPermission.set("temp_denied");
      broadcastOn.set(false);
    } else {
      geoPermission.set("temp_granted");
    }

    console.log({ geoPerm: geoPermission() });
  }

  reset() {
    const { geoService, stepper } = this;
    geoService.stopWatch();
    stepper?.reset();
  }

  ngOnDestroy() {
    this.geoService.stopWatch();
  }
}
