import {Component, ViewEncapsulation} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOption} from '@angular/material/select';
import {MainComponent} from '../mainarea/main/main.component';
import {RouterOutlet} from '@angular/router';


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
    RouterOutlet,
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,

})

export class ContainerComponent {

  openMenu() {
    this.menuVisible = true;
  }
  closeMenu() {
    this.menuVisible = false;
  }

  menuVisible = false;

}



