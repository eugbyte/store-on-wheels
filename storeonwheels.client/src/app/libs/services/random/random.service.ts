import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomService {
  getRandomNum(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

}
