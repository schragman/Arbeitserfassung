import {Component, DestroyRef, effect, EventEmitter, inject, OnInit, Output, signal} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {PrepareService} from '../services/prepare.service';
import {PreparedItem} from '../models/prepared-item.model';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {BookingService} from '../services/booking.service';

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
  private bookingService = inject(BookingService);
  protected readonly bookingElements = this.bookingService.bookingElements;
  public displayedColumns = ['Name', 'Buchungselement', 'Buchungstext', 'actions'];
  public preparedItems = signal<PreparedItem[]>([]);

  public formArray = signal<FormArray>(this.fb.array([
    this.preparedItems().map(item => this.createRowForm(item))
  ]));

  @Output() rowClicked = new EventEmitter<PreparedItem>();

  constructor() {
    // Effect wird erstellt, um auf Änderungen von preparedItems zu reagieren
    effect(() => {
      const items = this.preparedItems();
      const newFormArray = this.fb.array(
        items.map(item => this.createRowForm(item))
      );
      this.formArray.set(newFormArray);
      console.log("Item wurde angepasst");
      for (const row of newFormArray.controls) {
        console.log("Name = " + row.get('name')?.value);
        console.log("IsEditing = " + row.get('isEditing')?.value);
      }
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
      explainingText: [item.explainingText || ''],
      isEditing: [item.isEditing || false],
      backup: [null]
    });
  }

  addRow() {
      this.prepareService.addPreparedItem();
  }

  deleteRow(row: FormGroup) {
    const id:string = row.value.id;
    this.prepareService.deletePreparedItem(id);
  }

  startEdit(row: FormGroup) {
    row.patchValue({ isEditing: true });
    // Backup erstellen
    row.get('backup')?.setValue(row.value);
  }

  saveRow(row: FormGroup) {
    //const row = this.rows.at(index);
    const updatedItem: PreparedItem = {
      id: row.value.id,
      name: row.value.name,
      bookingelement: row.value.bookingelement,
      explainingText: row.value.explainingText,
      isEditing: false
    };

    this.prepareService.updatePreparedItem(updatedItem);
  }

  cancelEdit(row: FormGroup) {
    const backup = row.get('backup')?.value;
    if (backup) {
      row.patchValue(backup);
    }
    row.patchValue({ isEditing: false });
  }

  onRowClick(row: FormGroup) {
    const id:string = row.value.id;
    this.rowClicked.emit(this.preparedItems().find(item => item.id === id));
  }


}
