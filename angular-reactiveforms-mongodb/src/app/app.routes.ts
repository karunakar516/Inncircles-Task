import { Routes } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';
import { FormsComponent } from './forms/forms.component';
import { EditFormComponent } from './edit-form/edit-form.component';

export const routes: Routes = [
    { path: 'createForm', component: UserFormComponent },
    { path:'', redirectTo: '/getForms', pathMatch: 'full' },
    {path:'getForms', component: FormsComponent},
    {path:'editForm/:id', component: EditFormComponent}
];
