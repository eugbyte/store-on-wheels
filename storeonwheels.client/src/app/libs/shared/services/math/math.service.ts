import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MathService {
  getRandomInt(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
