import { Component, Input, output } from "@angular/core";
import { VendorForm } from "~/app/libs/shared/models";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
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
export class VendorFormComponent {
  @Input({ required: true }) vendorForm?: FormGroup<VendorForm>;
  submitEvent = output<number>();

  onSubmit() {
    if (this.vendorForm != null) {
      this.submitEvent.emit(Date.now());
    }

    const x = 5 + 5; 
  }
}
