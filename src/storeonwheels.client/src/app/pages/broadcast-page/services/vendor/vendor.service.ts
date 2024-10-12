import { Injectable } from "@angular/core";
import { Vendor } from "~/app/shared/models";
import axios, { AxiosError, AxiosResponse } from "axios";

@Injectable({
  providedIn: "root",
})
export class VendorService {
  async createVendor(vendor: Vendor): Promise<Vendor> {
    try {
      const response = await axios.post("/api/v1/vendors", vendor);
      const updatedVendor: Vendor = response.data;
      return updatedVendor;
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response as AxiosResponse<string, string>;
        const data = response.data ?? "";
        throw {
          name: "",
          status: response?.status,
          statusText: response?.statusText,
          message: data.slice(0, 400) + " ...",
          stack: "",
        };
      } else {
        throw error;
      }
    }
  }
}
