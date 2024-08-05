import { Component, Input, OnChanges, output } from "@angular/core";
import { VendorForm } from "~/app/libs/shared/models";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-vendor-form",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: "./vendor-form.component.html",
  styleUrl: "./vendor-form.component.css",
})
export class VendorFormComponent implements OnChanges {
  @Input({ required: true }) vendorForm?: FormGroup<VendorForm>;
  displayName: FormControl<string> | undefined;
  description: FormControl<string> | undefined;
  submitEvent = output<number>();

  ngOnChanges() {
    this.displayName = this.vendorForm?.controls.displayName;
    this.description = this.vendorForm?.controls.description;
  }

  onSubmit() {
    if (this.vendorForm != null) {
      this.submitEvent.emit(Date.now());
    }
  }
}
