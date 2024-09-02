import { Component,NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';
import { FormsComponent } from "./forms/forms.component";
import { ClientFormComponent } from './client-form/client-form.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserFormComponent, FormsComponent,ClientFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-reactiveforms-mongodb';
}
