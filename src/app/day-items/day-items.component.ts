import {Component, DestroyRef, EventEmitter, inject, OnInit, Output, signal} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {BookingItem} from '../models/booking-item.model';
import {BookingService} from '../services/booking.service';
import {DatePipe} from '@angular/common';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-day-items',
  imports: [
    MatTableModule,
    DatePipe,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    FormsModule
  ],
  standalone: true,
  templateUrl: './day-items.component.html',
  styleUrl: './day-items.component.scss'
})
export class DayItemsComponent implements OnInit {
  public dataSource = signal<BookingItem[]>([]);
  public displayedColumns = ['von', 'bis', 'Buchungselement', 'Buchungstext'];
  private bookingService = inject(BookingService);
  private destroyRef = inject(DestroyRef);
  protected selectedDay = signal<Date>(new Date());
  selectedId = '';
  protected relevantItems: BookingItem[] = [];

  @Output() rowClicked = new EventEmitter<string>();

  onRowClick(row: BookingItem) {
    this.rowClicked.emit(row.id);
    this.selectedId = row.id;
    console.log("Row clicked: " + row.id);
  }

  onDeselect() {
    this.selectedId = '';
  }

  updateSelectedDay(date: Date) {
    this.selectedDay.set(date);
    this.relevantItems = this.dataSource()
      .filter(item => item.date.toDateString() === date.toDateString())
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    console.log("Day changed to: " + date);
  }

  ngOnInit() {
    const subscription = this.bookingService.bookingitems$.subscribe({
      next: (value) => {
        this.dataSource.set(value);
        this.relevantItems = value
          .filter(item => item.date.toDateString() === this.selectedDay().toDateString())
          .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        let i = 0;
        for (const item of value) {
          i++;
          console.log(i+ "." + "Element von DayItemsComponent");
          console.log("----Datum: " + item.date)
          console.log("----Buchungselement: " + item.bookingelement)
          console.log("----Text: " + item.explainingText)
          console.log("----Id: " + item.id)
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
