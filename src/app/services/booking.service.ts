import {DestroyRef, inject, Injectable, signal} from '@angular/core';
import {BookingItem} from '../models/booking-item.model';
import {toObservable} from '@angular/core/rxjs-interop';
import {BookingElement} from '../models/booking-element.model';
import {ResponseBookedItem} from '../models/response-booked-item';
import {HttpClient} from '@angular/common/http';
import {fromDto, toDto} from '../helpers/booking-item.mapper';

@Injectable({
  providedIn: "root"
})

export class BookingService {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private readonly bookingitems = signal<BookingItem[]>([]);
  public bookingitems$ = toObservable(this.bookingitems);
  private temporaryBookingItem: BookingItem | null = null;


  public loadBookedItems() {
    const subscription = this.httpClient
      .get<ResponseBookedItem[]>('http://localhost:8088/bookeditems/items')
      .subscribe({
        next: (transferredbookedItems) => {
          console.log("Booked items are loaded: " + transferredbookedItems);
          let transferrableBookedItems:BookingItem[] = [];
          transferredbookedItems.forEach(bi => {
            const bookedItem:BookingItem = fromDto(bi);
            transferrableBookedItems.push(bookedItem);
          })

          this.bookingitems.set(transferrableBookedItems);
        }
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })

  }


  addDayItem(item: BookingItem) {
    const updatedItemList:BookingItem[] = [... this.bookingitems()];
    updatedItemList.push(item);
    this.bookingitems.set(updatedItemList);
    console.log("pushed new item: " + item.explainingText);
    const tranferrableBookingItem:ResponseBookedItem = toDto(item);

    const subscription =
      this.httpClient.put('http://localhost:8088/bookeditems/writeitem', tranferrableBookingItem)
        .subscribe({
          next: (response) => {
            console.log("Element updated: " + response);
          },
          error: (error) => {
            console.log(error);
          }
        });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  deleteItem(id: string) {
    const items = [...this.bookingitems()];
    const index = items.findIndex(item => item.id === id);
    if (index > -1) {
      items.splice(index, 1);
      this.bookingitems.set(items);
    }
    this.httpClient.delete('http://localhost:8088/bookeditems/deleteitem/' + id)
      .subscribe({
        next: (response) => {
          console.log("Element deleted: " + response);
        },
        error: (error) => {
          console.log(error);
        }
      })
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
