import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {BookingService} from '../services/booking.service';

@Component({
  selector: 'app-booking',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {

  @Input() form!: FormGroup;
  private bookingService = inject(BookingService);
  //protected readonly bookingElements = BookingElements;
  protected readonly bookingElements = this.bookingService.bookingElements;

  selectedOption = new FormControl<String | null>(null);

  logSelection() {
    console.log('Gewählt wurde: ', this.selectedOption.value);
  }

}
