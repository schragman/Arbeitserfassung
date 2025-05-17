import {Injectable} from '@angular/core';

@Injectable({
  providedIn: "root"
})

export class GeneralService {
  roundDateToNext5Minutes(date: Date): Date {
    const result = new Date(date);
    const minutes = result.getMinutes();
    const remainder = 5 - (minutes % 5);
    result.setMinutes(minutes + remainder);
    result.setSeconds(0);
    result.setMilliseconds(0);
    return result;
  }
}
