import {Injectable, signal} from '@angular/core';
import {BookingItem} from '../models/booking-item.model';
import {toObservable} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: "root"
})

export class BookingService {
  private readonly bookingitems = signal<BookingItem[]>([]);
  public bookingitems$ = toObservable(this.bookingitems);

  addDayItem(item: BookingItem) {
    const updatedItemList:BookingItem[] = [... this.bookingitems()];
    updatedItemList.push(item);
    this.bookingitems.set(updatedItemList);
    console.log("pushed item is " + item);
  }


}
