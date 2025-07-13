import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BookingElements} from '../recording/booking-elements';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';

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
  protected readonly bookingElements = BookingElements;

  selectedOption = new FormControl<String | null>(null);

  logSelection() {
    console.log('Gewählt wurde: ', this.selectedOption.value);
  }

}
