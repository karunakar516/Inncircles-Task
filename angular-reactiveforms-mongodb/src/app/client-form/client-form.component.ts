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
      this.buildForm(this.dataObject);
    });
  }
  buildForm(data: any): void {
    const dataObject = data;
    const formGroup = this.fb.group({});
    if (dataObject.sections && Array.isArray(dataObject.sections)) {
      dataObject.sections.forEach((section: any) => {
        const sectionGroup = this.fb.group([]);
        if (section.fields && Array.isArray(section.fields)) {
          section.fields.forEach((field: any) => {
            sectionGroup.addControl(field.title, new FormControl(''));
          });
        }
        formGroup.addControl(section.sectionTitle, sectionGroup);
      });
    }
    formGroup.addControl('formTitle',new FormControl(dataObject.formTitle));
    formGroup.addControl('formId',new FormControl(dataObject._id));
    this.fillForm = formGroup;
  }

  onSubmit(): void {
    if (this.fillForm.valid) {
      console.log('Form dataObject:', this.fillForm.value);
      const convertFormData = (formData:any) => {
        const { formId, formTitle, ...sections } = formData;

        return {
            formId,
            formTitle,
            sections: Object.keys(sections).map(sectionKey => ({
                sectionTitle: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
                fields: Object.keys(sections[sectionKey]).map(fieldKey => ({
                    title: fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1).replace('_', ' '),
                    value: sections[sectionKey][fieldKey]
                }))
            }))
        };
      };
      const formData = convertFormData(this.fillForm.value);
      this.userService.postClientData(formData).subscribe(data => {
        console.log(data);
        window.alert('Form submitted successfully');
        this.location.back();
      });
    } else {
      this.fillForm.markAllAsTouched();
    }
  }
}