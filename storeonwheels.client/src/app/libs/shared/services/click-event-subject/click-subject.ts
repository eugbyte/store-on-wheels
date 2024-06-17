import { BehaviorSubject } from "rxjs";
import { InjectionToken } from "@angular/core";

export interface ClickProps {
  vendorId: string;
  source: string;
}

export const CLICK_SUBJECT = new InjectionToken<BehaviorSubject<ClickProps>>(
  "click.event"
);

export const clickSubject = new BehaviorSubject<ClickProps>({
  vendorId: "",
  source: "",
});
