import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  fillForm!: FormGroup;
  dataObject: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fillForm = this.fb.group({}); 
    this.loadForm();
  }

  loadForm(): void {
    let id :any= this.route.snapshot.paramMap.get('id');
    if(id==null) id='1';
    this.userService.getFormStructure(id).subscribe(data => {
      this.dataObject = data.data;
      console.log('Form structure:', this.dataObject);
      this.buildForm(data);
    });
  }
  buildForm(data: any): void {
    const formGroup = this.fb.group({});
    if (data.sections && Array.isArray(data.sections)) {
      data.sections.forEach((section: any) => {
        const sectionGroup = this.fb.group({});
        if (section.fields && Array.isArray(section.fields)) {
          section.fields.forEach((field: any) => {
            console.log(`Adding control: ${field.name}`);
            sectionGroup.addControl(field.title, new FormControl(field.name || ''));
          });
        }
        console.log(`Adding section: ${section.sectionTitle}`);
        // formGroup.addControl(section.sectionTitle, sectionGroup);
      });
    }
    this.fillForm = formGroup;
  }

  onSubmit(): void {
    if (this.fillForm.valid) {
      console.log('Form Data:', this.fillForm.value);
      // Submit the form data to the server
    } else {
      this.fillForm.markAllAsTouched();
    }
  }
}