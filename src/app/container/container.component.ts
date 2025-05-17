import {Component, inject, ViewEncapsulation} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MAT_TIMEPICKER_CONFIG} from '@angular/material/timepicker';
import {RecordingComponent} from '../recording/recording.component';
import {MatOption, MatSelect} from '@angular/material/select';
import {BookingElements} from '../recording/booking-elements';
import {BookingComponent} from '../booking/booking.component';
import {GeneralService} from '../services/general.service';
import {BookingItem} from '../models/booking-item.model';
import {BookingService} from '../services/booking.service';
import {DayItemsComponent} from '../day-items/day-items.component';


@Component({
  selector: 'app-container',
  imports: [
    BookingComponent,
    DayItemsComponent,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatLabel,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatInput,
    MatSelect,
    MatOption,
    MatSuffix,
    FormsModule,
    ReactiveFormsModule,
    RecordingComponent,
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,

})
  export class ContainerComponent {

    menuVisible = false;

    private generalService = inject(GeneralService);
    private bookingService = inject(BookingService);

    openMenu() {
      this.menuVisible = true;
    }
    closeMenu() {
      this.menuVisible = false;
    }

   now = new Date();

    mainForm = new FormGroup({
      datesForm: new FormGroup({
        bookingdate: new FormControl(new Date()),
        bookingfrom: new FormControl(),
        bookingtil: new FormControl(this.generalService.roundDateToNext5Minutes(new Date()))
      }),
      bookingForm: new FormGroup({
        bookingelement: new FormControl(),
        explainingText: new FormControl()
      })

    })

    datesForm = this.mainForm.get('datesForm') as FormGroup;
    bookingForm = this.mainForm.get('bookingForm') as FormGroup;

    onSubmit() {
      const item: BookingItem = {
        date: this.mainForm.value.datesForm?.bookingdate!,
        startTime: this.mainForm.value.datesForm?.bookingfrom!,
        endTime: this.mainForm.value.datesForm?.bookingtil!,
        bookingelement: this.mainForm.value.bookingForm?.bookingelement!,
        explainingText: this.mainForm.value.bookingForm?.explainingText!,
        id:""
      };
      this.bookingService.addDayItem(item);

    }

    protected readonly FormGroup = FormGroup;
  }



