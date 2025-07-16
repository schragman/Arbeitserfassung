import {Component, effect, inject, signal} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTableModule
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {BookingService} from '../../services/booking.service';
import {PreparedItem} from '../../models/prepared-item.model';
import {BookingElement} from '../../models/booking-element.model';
import {SettingsService} from '../../services/settings.service';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-bookings',
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatRow,
    MatRowDef,
    MatTableModule,
    ReactiveFormsModule
  ],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent {
  private bookingService = inject(BookingService);
  private settingsService = inject(SettingsService)
  private fb = inject(FormBuilder)
  protected formArray = signal<FormArray>(this.fb.array([]));
  protected tableForm = this.fb.group({
    rows: this.formArray()
  });

  protected readonly displayedColumns = ['Buchungselement', 'actions'];
  protected readonly bookingElements = this.bookingService.bookingElements;

  constructor() {
    // Effect wird erstellt, um auf Änderungen von preparedItems zu reagieren
    effect(() => {
      const newFormArray = this.fb.array(
        this.bookingElements().map(item => this.createRowForm(item))
      );
      this.formArray.set(newFormArray);
      console.log("Item wurde angepasst");

    });
  }

  protected addRow() {
    this.settingsService.addEmptyElement()
  }

  protected saveRow(row: FormGroup) {
    const updatedItem: BookingElement = {
      id: row.value.id,
      element: row.value.name,
      isEditing: false
    }
    this.settingsService.updateBookingElement(updatedItem);
  }

  deleteRow(row: FormGroup) {
    const id:string = row.value.id;
    this.settingsService.deleteBookingElement(id);
  }

  startEdit(row: FormGroup) {
    row.patchValue({ isEditing: true });
    // Backup erstellen
    row.get('backup')?.setValue(row.value);
  }

  cancelEdit(row: FormGroup) {
    const backup = row.get('backup')?.value;
    if (backup) {
      row.patchValue(backup);
    }
    row.patchValue({ isEditing: false });
  }

  private createRowForm(item: BookingElement): FormGroup {
    return this.fb.group({
      id: [item.id],
      name: [item.element || ''],
      isEditing: [item.isEditing || false],
      backup: [null]
    });
  }

}
