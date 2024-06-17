import { BehaviorSubject } from "rxjs";
import { InjectionToken } from "@angular/core";

export interface ClickProps {
  vendorId: string;
  source: string;
}

<<<<<<< HEAD
export const CLICK_SUBJECT = new InjectionToken<BehaviorSubject<ClickProps>>(
=======
export const CLICK_SUBJECT = new InjectionToken<BehaviorSubject<string>>(
>>>>>>> 0f53a82 (chore: cache with timeout)
  "click.event"
);

export const clickSubject = new BehaviorSubject<ClickProps>({
  vendorId: "",
  source: "",
});
