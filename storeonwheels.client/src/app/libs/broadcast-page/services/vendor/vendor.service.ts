import { Injectable } from "@angular/core";
import { Vendor } from "~/app/libs/shared/models";
import axios from "axios";

@Injectable({
  providedIn: "root",
})
export class VendorService {
  constructor() {}

  async createVendor(vendor: Vendor): Promise<Vendor> {
    const response = await axios.post("/api/v1/vendors", vendor);
    const updatedVendor = response.data;
    return updatedVendor;
  }
}
