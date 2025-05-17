import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {BookingItem} from '../models/booking-item.model';
import {BookingService} from '../services/booking.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-day-items',
  imports: [
    MatTableModule,
    DatePipe
  ],
  standalone: true,
  templateUrl: './day-items.component.html',
  styleUrl: './day-items.component.css'
})
export class DayItemsComponent implements OnInit {
  public dataSource = signal<BookingItem[]>([]);
  public displayedColumns = ['von', 'bis', 'Buchungselement', 'Buchungstext'];
  private bookingService = inject(BookingService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const subscription = this.bookingService.bookingitems$.subscribe({
      next: (value) => {
        this.dataSource.set(value);
        let i = 0;
        for (const item of value) {
          i++;
          console.log(i+ "." + "Element von DayItemsComponent");
          console.log("----Datum: " + item.date)
          console.log("----Buchungselement: " + item.bookingelement)
          console.log("----Text: " + item.explainingText)
        }
      },
      error: (error) => {
        console.log(error);
      },
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

}
