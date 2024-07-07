import { Component, OnInit, ViewChild, signal } from "@angular/core";
import { GeolocateService } from "~/app/libs/broadcast-page/services";
import {
  MessageHubService,
  WsState,
  hubConnection,
} from "~/app/libs/map-page/services";
import { GeoInfo, Vendor, VendorForm } from "~/app/libs/shared/models";
import { Observable } from "rxjs";
import { VendorService } from "~/app/libs/broadcast-page/services";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  GeoPermissionComponent,
  VendorFormComponent,
} from "~/app/libs/broadcast-page/components";
import { MatButtonModule } from "@angular/material/button";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { SleepService } from "~/app/libs/shared/services";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: "app-broadcast-page",
  standalone: true,
  imports: [
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
  @ViewChild("stepper", { read: MatStepper }) stepper?: MatStepper;
  isLinear = false;
  vendorBtnText = signal("Next");
  vendorBtnEnabled = signal(true);

  vendorForm: FormGroup<VendorForm> = this.formBuilder.nonNullable.group({
    id: ["", Validators.required],
    displayName: ["", Validators.required],
    description: ["", Validators.required],
  });

  geoPermissionState: PermissionState = "denied";

  canBroadcast = false;
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
  }

  async ngOnInit() {
    this.messageHub.state$.subscribe((state: WsState) =>
      this.vendorForm.patchValue({ id: state.connectionId ?? "" })
    );
    this.position$.subscribe((position: GeolocationPosition) => {
      const geoInfo = new GeoInfo();
      geoInfo.coords = position.coords;
      geoInfo.timestamp = Date.now();

      const vendorId: string = hubConnection.connectionId ?? "";
      this.messageHub.sendGeoInfo(vendorId, geoInfo);
      this.vendorForm;
    });

    const geoPermissionState = await this.geoService.getPermissionState();
    this.geoPermissionState = geoPermissionState;
    console.log({ geoPermissionState });
  }

  async onSubmit() {
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

  async grantPermission() {
    try {
      await this.geoService.geolocate(5000);
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        // Firefox does not treat temporary denial as "denied" but "prompt"
        if (error.code == GeolocationPositionError.PERMISSION_DENIED) {
          this.geoPermissionState = "denied";
        }
      }
    }
  }

  toggle() {
    const { canBroadcast, geoService } = this;
    console.log({ canBroadcast });
    if (!canBroadcast) {
      geoService.stopWatch();
    } else {
      geoService.watchPosition(5000);
    }
  }
}
