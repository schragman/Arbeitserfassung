import {inject, Injectable, signal} from '@angular/core';
import {BookingElement} from '../models/booking-element.model';
import {BookingService} from './booking.service';

@Injectable({
  providedIn: "root"
})
export class SettingsService {
  private bookingService = inject(BookingService);

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

  public deleteBookingElement(id: string) {
    const bookingElements = [...this.bookingService.bookingElements()];
    const index = bookingElements.findIndex(element => element.id === id);
    if (index > -1) {
      bookingElements.splice(index, 1);
      this.bookingService.bookingElements.set(bookingElements);
    }
  }

  public updateBookingElement(element: BookingElement) {
    const bookingElements = [...this.bookingService.bookingElements()];
    const index = bookingElements.findIndex(element => element.id === element.id);
    if (index > -1) {
      bookingElements[index] = element;
    }
  }

}
