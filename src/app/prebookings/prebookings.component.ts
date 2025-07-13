import {Component, DestroyRef, effect, inject, OnInit, signal} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {PrepareService} from '../services/prepare.service';
import {BookingItem} from '../models/booking-item.model';
import {subscriptionLogsToBeFn} from 'rxjs/internal/testing/TestScheduler';
import {PreparedItem} from '../models/prepared-item.model';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {BookingElements} from '../recording/booking-elements';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-prebookings',
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatTableModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './prebookings.component.html',
  styleUrl: './prebookings.component.css'
})
export class PrebookingsComponent implements OnInit {

  private prepareService = inject(PrepareService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  protected readonly bookingElements = BookingElements;
  public displayedColumns = ['Name', 'Buchungselement', 'Buchungstext', 'actions'];
  public preparedItems = signal<PreparedItem[]>([]);

  public formArray = signal<FormArray>(this.fb.array([]));

  constructor() {
    // Effect wird erstellt, um auf Änderungen von preparedItems zu reagieren
    effect(() => {
      const items = this.preparedItems();
      const newFormArray = this.fb.array(
        items.map(item => this.createRowForm(item))
      );
      this.formArray.set(newFormArray);
    });
  }

  ngOnInit() {
    const subscription = this.prepareService.preparedItems$.subscribe({
      next: (value) => {
        this.preparedItems.set(value);
      },
      error: (error) => {
        console.log(error);
      },
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  tableForm = this.fb.group({
    rows: this.formArray()
  });

  get rows() {
    return this.tableForm.get('rows') as FormArray;
  }

  private createRowForm(item: PreparedItem): FormGroup {
    return this.fb.group({
      id: [item.id],
      name: [item.name || ''],
      bookingelement: [item.bookingelement || ''],
      buchungstext: [item.explainingText || ''],
      isEditing: [true]
    });
  }

  addRow() {
      this.prepareService.addPreparedItem();
  }

  startEdit(index: number) {
    const row = this.rows.at(index);
    row.patchValue({ isEditing: true });
    // Backup erstellen
    row.get('backup')?.setValue(row.value);
  }

  saveRow(row: FormGroup) {
    //const row = this.rows.at(index);
    row.patchValue({ isEditing: false });

    const newItem: PreparedItem = {
      id: row.value.id,
      name: row.value.name,
      bookingelement: row.value.bookingelement,
      explainingText: row.value.buchungstext,
      isEditing: false
    };

    this.prepareService.updatePreparedItem(newItem);
  }

  cancelEdit(index: number) {
    const row = this.rows.at(index);
    const backup = row.get('backup')?.value;
    if (backup) {
      row.patchValue(backup);
    }
    row.patchValue({ isEditing: false });
  }




}
