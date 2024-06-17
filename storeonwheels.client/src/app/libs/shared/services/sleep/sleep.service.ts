import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SleepService {

  constructor() { }

  sleep(): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
