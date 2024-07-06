import { Component, Input, output } from "@angular/core";
import { Vendor, VendorForm } from "~/app/libs/shared/models";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-vendor-form",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./vendor-form.component.html",
  styleUrl: "./vendor-form.component.css",
})
export class VendorFormComponent {
  @Input({ required: true }) vendorForm?: FormGroup<VendorForm>;
  submitEvent = output<Vendor>();

  onSubmit() {
    if (this.vendorForm == null) {
      return;
    }
    const vendor = this.vendorForm.value as Vendor;
    this.submitEvent.emit(vendor);
  }
}
