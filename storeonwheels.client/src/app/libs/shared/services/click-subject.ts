import { BehaviorSubject } from "rxjs";
import { InjectionToken } from "@angular/core";

export const CLICK_SUBJECT = new InjectionToken<BehaviorSubject<string>>(
  "click.event description"
);

export const clickSubject = new BehaviorSubject("");
