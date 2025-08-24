import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOption} from '@angular/material/select';
import {MainComponent} from '../mainarea/main/main.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {SettingsService} from '../services/settings.service';
import {PrepareService} from '../services/prepare.service';
import {BookingService} from '../services/booking.service';


@Component({
  selector: 'app-container',
  imports: [
    MainComponent,
    MatIcon,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatOption,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,

})

export class ContainerComponent implements OnInit{

  private settingService = inject(SettingsService);
  private prepareService = inject(PrepareService);
  private bookingService = inject(BookingService);

  ngOnInit() {
    this.settingService.loadBookingElements();
    this.prepareService.loadPreparedItems();
    this.bookingService.loadBookedItems();
  }

  openMenu() {
    this.menuVisible = true;
  }
  closeMenu() {
    this.menuVisible = false;
  }

  menuVisible = false;

}



