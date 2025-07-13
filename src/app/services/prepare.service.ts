import {Injectable, signal} from '@angular/core';
import {BookingItem} from '../models/booking-item.model';
import {toObservable} from '@angular/core/rxjs-interop';
import {PreparedItem} from '../models/prepared-item.model';

@Injectable({
  providedIn: "root"
})
export class PrepareService {
  private readonly preparedItems = signal<PreparedItem[]>([]);
  public preparedItems$ = toObservable(this.preparedItems);

  public addPreparedItem() {
    const updatedItemList:PreparedItem[] = [... this.preparedItems()];
    const emptyItem = {
      id: crypto.randomUUID(),
      name: '',
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
    console.log("Updated prepared item Name:" + preparedItem.name);
    console.log("Updated prepared item isEditing:" + preparedItem.isEditing);
  }

  public deletePreparedItem(id: string) {
    this.preparedItems.set(this.preparedItems().filter(item => item.id !== id));
  }

}
