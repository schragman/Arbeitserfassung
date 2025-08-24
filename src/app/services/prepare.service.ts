import {DestroyRef, inject, Injectable, signal} from '@angular/core';
import {BookingItem} from '../models/booking-item.model';
import {toObservable} from '@angular/core/rxjs-interop';
import {PreparedItem} from '../models/prepared-item.model';
import {ResponsePreparedItem} from '../models/response-prepared-item';
import {HttpClient} from '@angular/common/http';
import {ResponseBookingElement} from '../models/response-booking-element';
import {BookingElement} from '../models/booking-element.model';

@Injectable({
  providedIn: "root"
})
export class PrepareService {
  private readonly preparedItems = signal<PreparedItem[]>([]);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  public preparedItems$ = toObservable(this.preparedItems);

  public loadPreparedItems() {
    const subscription = this.httpClient
      .get<ResponsePreparedItem[]>('http://localhost:8088/prepareditems/items')
      .subscribe({
        next: (preparedItems) => {
          let initialPreparedItems:PreparedItem[] = [];
          preparedItems.forEach(element => {
            const transferredPreparedItem:PreparedItem =
              {
                id: element.id,
                bookingelement: element.bookingelement,
                explainingText: element.explainingtext,
                isEditing: false
              };
            initialPreparedItems.push(transferredPreparedItem);
          })
          this.preparedItems.set(initialPreparedItems);
          console.log("Prepared items are loaded");
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  public addPreparedItem() {
    const updatedItemList:PreparedItem[] = [... this.preparedItems()];
    const emptyItem = {
      id: crypto.randomUUID(),
      bookingelement: '',
      explainingText: '',
      isEditing: true,
    }
    updatedItemList.push(emptyItem);
    this.preparedItems.set(updatedItemList);
    console.log("pushed empty item");
  }

  public updatePreparedItem(preparedItem: PreparedItem) {
    this.preparedItems.set(this.preparedItems().map(item => item.id === preparedItem.id ? preparedItem : item));
    console.log("Updated prepared item Name:" + preparedItem.explainingText);
    console.log("Updated prepared item isEditing:" + preparedItem.isEditing);

    const requestPreparedItem: ResponsePreparedItem = {
      id: preparedItem.id,
      bookingelement: preparedItem.bookingelement,
      explainingtext: preparedItem.explainingText
    }

    this.httpClient.put('http://localhost:8088/prepareditems/writeitem', requestPreparedItem)
      .subscribe({
        next: (response) => {
          console.log("Element updated: " + response);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  public deletePreparedItem(id: string) {
    this.preparedItems.set(this.preparedItems().filter(item => item.id !== id));
    this.httpClient.delete('http://localhost:8088/prepareditems/deleteitem/' + id)
      .subscribe({
        next: (response) => {
          console.log("Element deleted: " + response);
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

}
