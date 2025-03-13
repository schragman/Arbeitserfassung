import {Component, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  MatDrawer,
  MatDrawerContainer, MatDrawerContent,
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent
} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatHint} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import {ContainerComponent} from './container/container.component';

@Component({
  selector: 'app-root',
  imports: [
    ContainerComponent,
    FormsModule,
    MatSidenavContainer,
    MatToolbar,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [provideNativeDateAdapter()],
  standalone: true
})
export class AppComponent {
  title = 'Arbeitserfassung';

  @ViewChild(ContainerComponent) containerComponent!: ContainerComponent

  onClickBurger() {
    this.containerComponent.openMenu();
  }
}
