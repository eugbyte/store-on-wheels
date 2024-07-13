import { CommonModule } from "@angular/common";
import {
  Component,
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
    MatDividerModule,
  ],
  templateUrl: "./broadcast-page.component.html",
  styleUrl: "./broadcast-page.component.css",
})
export class BroadcastPageComponent implements OnInit {
  private position$: Observable<GeolocationPosition> = new Observable();
  private posError$: Observable<GeolocationPositionError> = new Observable();
  posError: Signal<GeolocationPositionError | undefined> = signal(undefined);
  coordinates: WritableSignal<GeolocationCoordinates | undefined> =
    signal(undefined);

  // 1. Create Vendor.
  @ViewChild("stepper", { read: MatStepper }) stepper?: MatStepper;
  isLinear = false;
  vendorBtnText = signal("Next");
  vendorBtnEnabled = signal(true);

  vendorForm: FormGroup<VendorForm> = this.formBuilder.nonNullable.group({
    id: ["", Validators.required],
    displayName: ["", Validators.required],
    description: ["", Validators.required],
  });

  // 2. Broadcast toggle.
  geoPermission = signal<PermissionState>("denied");
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
    this.posError$ = geoService.error$;
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

    this.posError$.subscribe((err) => {
      console.log(err);
    });

    const permission: PermissionState =
      await this.geoService.getPermPermissionState();
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
      const permanentPerm: PermissionState =
        await geoService.getPermPermissionState();
      geoPermission.set(permanentPerm);
      return;
    }

    const error = await geoService.watchPosition();

    // need to set the permission explicitly, instead of calling geoService.getPermPermissionState as permission might be temporary.
    // geoService.getPermPermissionState will return "prompt" regardless
    if (
      error != null &&
      error.code == GeolocationPositionError.PERMISSION_DENIED
    ) {
      geoPermission.set("denied");
      broadcastOn.set(false);
    } else if (error == null) {
      geoPermission.set("granted");
    }
  }

  reset() {
    const { geoService } = this;
    geoService.stopWatch();
    this.stepper?.reset();
  }
}
