import {Component, inject, signal, ViewChild} from '@angular/core';
import {BookingComponent} from "../../booking/booking.component";
import {DayItemsComponent} from "../../day-items/day-items.component";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatSidenavContent} from "@angular/material/sidenav";
import {PrebookingsComponent} from "../../prebookings/prebookings.component";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RecordingComponent} from "../../recording/recording.component";
import {GeneralService} from '../../services/general.service';
import {Modes} from '../../models/modes';
import {BookingItem} from '../../models/booking-item.model';
import {PreparedItem} from '../../models/prepared-item.model';
import {BookingService} from '../../services/booking.service';

@Component({
  selector: 'app-main',
    imports: [
        BookingComponent,
        DayItemsComponent,
        MatButton,
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        MatSidenavContent,
        PrebookingsComponent,
        ReactiveFormsModule,
        RecordingComponent
    ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  @ViewChild(DayItemsComponent) dayItemsComponent!: DayItemsComponent;

  private generalService = inject(GeneralService);
  private bookingService = inject(BookingService);
  private mode: Modes = Modes.normal;
  protected okLabel = signal('Buchen')
  protected cancelLabel = signal('Löschen')
  private selectedRow: BookingItem |null = null;

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
    if (this.mode === Modes.edit && this.selectedRow) {
      this.bookingService.deleteItem(this.selectedRow?.id)
    }
    const item: BookingItem = {
      date: this.mainForm.value.datesForm?.bookingdate!,
      startTime: this.mainForm.value.datesForm?.bookingfrom!,
      endTime: this.mainForm.value.datesForm?.bookingtil!,
      bookingelement: this.mainForm.value.bookingForm?.bookingelement!,
      explainingText: this.mainForm.value.bookingForm?.explainingText!,
      id: crypto.randomUUID()
    };
    this.bookingService.addDayItem(item);
    this.onCompleteBooking(this.datesForm.get('bookingtil')?.value)
    if (this.mode === Modes.edit) {
      this.installTemporaryBookingItem();
    }
  }

  onCancel() {
    if (this.mode === Modes.normal) {
      this.onCompleteBooking(null);
    } else {
      this.installTemporaryBookingItem();
    }
  }

  private installTemporaryBookingItem() {
    this.setBookingForm(this.bookingService.getTemporaryBookingItem());
    this.mode = Modes.normal;
    this.renameButtons(this.mode);
    this.dayItemsComponent.onDeselect();
  }

  onPreparedRowSelected(preparedItem: PreparedItem) {
    let preparedBookingItem: BookingItem;
    preparedBookingItem = {
      date: this.datesForm.get('bookingdate')?.value,
      startTime: this.datesForm.get('bookingfrom')?.value,
      endTime: this.datesForm.get('bookingtil')?.value,
      bookingelement: preparedItem.bookingelement,
      explainingText: preparedItem.explainingText,
      id: crypto.randomUUID()
    }
    this.setBookingForm(preparedBookingItem);

  }

  onRowSelected(rowId: string) {
    let tempBookingItem: BookingItem | null = null;
    if (this.mode === Modes.normal) {
      tempBookingItem = {
        startTime: this.datesForm.get('bookingfrom')?.value,
        endTime: this.datesForm.get('bookingtil')?.value,
        date: this.datesForm.get('bookingdate')?.value,
        bookingelement: this.bookingForm.get('bookingelement')?.value,
        explainingText: this.bookingForm.get('explainingText')?.value,
        id: 'temp'
      }
    }
    this.selectedRow = this.bookingService.showSelectedItem(rowId, tempBookingItem);
    this.setBookingForm(this.selectedRow);
    this.mode = Modes.edit;
    this.renameButtons(this.mode);
  }

  private onCompleteBooking(bookingFromValue: AbstractControl | null) {
    this.bookingForm.get('explainingText')?.setValue(null);
    this.bookingForm.get('bookingelement')?.setValue(null);
    this.datesForm.get('bookingfrom')?.setValue(bookingFromValue);
    this.datesForm.get('bookingtil')?.setValue(this.generalService.roundDateToNext5Minutes(new Date()));
  }

  private setBookingForm(bookingItem?: BookingItem) {
    if (bookingItem) {
      this.bookingForm.get('explainingText')?.setValue(bookingItem.explainingText);
      this.bookingForm.get('bookingelement')?.setValue(bookingItem.bookingelement);
      this.datesForm.get('bookingfrom')?.setValue(bookingItem.startTime);
      this.datesForm.get('bookingtil')?.setValue(bookingItem.endTime);
      this.datesForm.get('bookingdate')?.setValue(bookingItem.date);
    }
  }

  private renameButtons(mode: Modes) {
    if (mode === Modes.normal) {
      this.okLabel.update(value => 'Buchen')
      this.cancelLabel.update(value => 'Löschen')
    } else {
      this.okLabel.update(value => 'Ändern')
      this.cancelLabel.update(value => 'Abbrechen')
    }
  }
}
