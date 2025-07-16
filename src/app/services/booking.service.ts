import {Injectable, signal} from '@angular/core';
import {BookingItem} from '../models/booking-item.model';
import {toObservable} from '@angular/core/rxjs-interop';
import {BookingElement} from '../models/booking-element.model';

@Injectable({
  providedIn: "root"
})

export class BookingService {
  private readonly bookingitems = signal<BookingItem[]>([]);
  public bookingitems$ = toObservable(this.bookingitems);
  private temporaryBookingItem: BookingItem | null = null;

  addDayItem(item: BookingItem) {
    const updatedItemList:BookingItem[] = [... this.bookingitems()];
    updatedItemList.push(item);
    this.bookingitems.set(updatedItemList);
    console.log("pushed item is " + item);
  }

  deleteItem(id: string) {
    const items = [...this.bookingitems()];
    const index = items.findIndex(item => item.id === id);
    if (index > -1) {
      items.splice(index, 1);
      this.bookingitems.set(items);
    }
  }

  showSelectedItem(rowId: string, bookingItem: BookingItem | null) :BookingItem {
    if (bookingItem) {
      this.temporaryBookingItem = bookingItem;
    }
    return this.bookingitems().find(item => item.id === rowId)!;
  }

  getTemporaryBookingItem() :BookingItem {
    return this.temporaryBookingItem!;
  }

  public readonly bookingElements = signal<BookingElement[]>([
    {
      id: '1',
      element: 'Aufteilung',
      isEditing: false
    },
    {
      id: '2',
      element: 'Betrieb Makler-Webservices',
      isEditing: false
    },
    {
      id: '3',
      element: 'Kerwartung Makler-Webservices',
      isEditing: false
    },
    {
      id: '4',
      element: 'Betrieb Autentifizierung',
      isEditing: false
    },
    {
      id: '5',
      element: 'Kerwartung Autentifizierung',
      isEditing: false
    },
  ]);

}
