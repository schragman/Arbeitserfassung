import {Component, inject, Input} from '@angular/core';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MAT_TIMEPICKER_CONFIG, MatTimepickerModule, MatTimepickerToggle} from '@angular/material/timepicker';
import {AbstractControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {BookingElements} from './booking-elements';
import {GeneralService} from '../services/general.service';

@Component({
  selector: 'app-recording',
  imports: [
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatTimepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSuffix,
  ],
  templateUrl: './recording.component.html',
  standalone: true,
  styleUrl: './recording.component.css',
  providers: [
    {
      provide: MAT_TIMEPICKER_CONFIG,
      useValue: {interval: '5 minutes'},
    }
  ]
})
export class RecordingComponent {

  @Input() form!: FormGroup;

  private bookingFrom : AbstractControl  | null  = null;
  private bookingtil : AbstractControl  | null = null;
  private generalService = inject(GeneralService);

  ngOnInit() {
    this.bookingFrom = this.form.get('bookingfrom');
    this.bookingtil = this.form.get('bookingtil');

  }
  selectedDate = new Date();

  endingTime?: Date;
  startingTime?: Date;
  setCurrentTime() {
    //const datesGroup = this.form.get('dates') as FormGroup;
    //const til = this.form.get('bookingtil');
    //console.log("this.bookingtil = " + this.bookingtil?.value);
    this.bookingtil?.setValue(this.generalService.roundDateToNext5Minutes(new Date()));

  }

  transferEndingTime() {
    /*const til = this.form.get('bookingtil');
    const from = this.form.get('bookingfrom');
    from?.setValue(til?.value);*/
    //console.log(this.bookingFrom?.value)
    this.bookingFrom?.setValue(this.bookingtil?.value);
  }

  completeBooking() {
    this.bookingFrom = this.bookingtil;
    this.setCurrentTime();
  }

  deleteBooking() {
    this.bookingFrom = null;
    this.setCurrentTime();
  }

}
