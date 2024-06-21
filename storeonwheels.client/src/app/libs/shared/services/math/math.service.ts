import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MathService {
  getRandomInt(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  getOrDefault<U, T>(obj: Map<U, T>, key: U, defaultValue: T): T {
    return obj.get(key) ?? defaultValue;
  }
}
