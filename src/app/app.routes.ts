import { Routes } from '@angular/router';
import {BookingsComponent} from './settings/bookings/bookings.component';
import {MainComponent} from './mainarea/main/main.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'settings/bookings',
    component: BookingsComponent
  }
];
