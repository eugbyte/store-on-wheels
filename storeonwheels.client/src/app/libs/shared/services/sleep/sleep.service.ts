import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SleepService {

  constructor() { }

  sleep(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
