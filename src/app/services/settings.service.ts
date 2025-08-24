import {DestroyRef, inject, Injectable, OnInit, signal} from '@angular/core';
import {BookingElement} from '../models/booking-element.model';
import {BookingService} from './booking.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';
import {ResponseBookingElement} from '../models/response-booking-element';

@Injectable({
  providedIn: "root"
})
export class SettingsService {
  private bookingService = inject(BookingService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  public loadBookingElements() {
    const subscription = this.httpClient
      .get<ResponseBookingElement[]>('http://localhost:8088/settings/bookingitems')
      .subscribe({
        next: (bookingElements) => {
          let initialBookingElements:BookingElement[] = [];
          bookingElements.forEach(element => {
            const transferredBookingElement:BookingElement =
              {
                id: element.id,
                element: element.element,
                isEditing: false
              };
            initialBookingElements.push(transferredBookingElement);
          })
          this.bookingService.bookingElements.set(initialBookingElements);
          console.log("Booking elements loaded");
          for (const element of initialBookingElements) {
            console.log("Element: " + element.element + " isEditing: " + element.isEditing);
          }
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  public addEmptyElement() {
    const updatedBookingElements:BookingElement[] = [... this.bookingService.bookingElements()];
    const newElement = {
      id: crypto.randomUUID(),
      element: '',
      isEditing: true
    }
    updatedBookingElements.push(newElement);
    this.bookingService.bookingElements.set(updatedBookingElements);
    console.log("pushed new element: " + newElement.element);
  }

  public updateBookingElement(element: BookingElement) {
    const updatedBookingElements = [...this.bookingService.bookingElements()];
    const index = updatedBookingElements.findIndex(item => element.id === item.id);

    if (index > -1) {
      console.log("Element found at index: " + index + " with id: " + element.id + " and name: " + element.element + " and isEditing: " + element.isEditing);
      updatedBookingElements[index] = element;
    }
    this.bookingService.bookingElements.set(updatedBookingElements);
    console.log("Updated booking element Name:" + element.element);

    this.writeBookingElement(element);


  }

  public deleteBookingElement(id: string) {
    const bookingElements = [...this.bookingService.bookingElements()];
    const index = bookingElements.findIndex(element => element.id === id);
    if (index > -1) {
      bookingElements.splice(index, 1);
      this.bookingService.bookingElements.set(bookingElements);
    }
    this.httpClient.delete('http://localhost:8088/settings/deletebookingitem/' + id)
      .subscribe({
        next: (response) => {
          console.log("Element deleted: " + response);
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

  private writeBookingElement(element: BookingElement) {
    const requestBookingElement: ResponseBookingElement = {
      id: element.id,
      element: element.element,
    }
    this.httpClient.put('http://localhost:8088/settings/writebookingitem', requestBookingElement)
      .subscribe({
        next: (response) => {
          console.log("Element updated: " + response);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }



}
