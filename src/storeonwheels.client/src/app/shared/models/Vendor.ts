import { FormControl } from "@angular/forms";

export class Vendor {
  id = "";
  displayName = "";
  description = "";
}

export interface VendorForm {
  id: FormControl<string>;
  displayName: FormControl<string>;
  description: FormControl<string>;
}
