import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [UserService],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public userservice: UserService,
    private location: Location
  ) {}
  // constructor(private fb: FormBuilder, public userservice: UserService) {}

  ngOnInit(): void {
    this.initForm();
    this.addSection();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      formTitle: ['', Validators.required],
      sections: this.fb.array([]),
    });
  }

  getSections(): FormArray {
    return this.userForm.get('sections') as FormArray;
  }

  addSection(): void {
    const section = this.fb.group({
      sectionTitle: ['', Validators.required],
      fields: this.fb.array([]),
    });
    this.getSections().push(section);
  }

  addField(sectionIndex: number): void {
    const field = this.fb.group({
      title: ['', Validators.required],

      body: ['', Validators.required],
      value: [{ value: '', disabled: true }],
      options: this.fb.array([]),
      require: [false],
      showCard: [false],
      unique: [false],
    });
    this.getFields(sectionIndex).push(field);
  }

  addOption(sectionIndex: number, fieldIndex: number): void {
    const field = this.getField(sectionIndex, fieldIndex);
    (field.get('options') as FormArray).push(this.fb.control(''));
  }

  removeSection(sectionIndex: number): void {
    this.getSections().removeAt(sectionIndex);
  }

  removeField(sectionIndex: number, fieldIndex: number): void {
    this.getFields(sectionIndex).removeAt(fieldIndex);
  }

  removeOption(
    sectionIndex: number,
    fieldIndex: number,
    optionIndex: number
  ): void {
    const field = this.getField(sectionIndex, fieldIndex);
    (field.get('options') as FormArray).removeAt(optionIndex);
  }
  logValidationErrors(group: FormGroup | FormArray): void {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.logValidationErrors(control);
      } else if (control && control.invalid) {
        console.log(`Control ${key} is invalid:`, control.errors);
      }
    });
  }

  submit(): void {
    if (this.userForm.valid) {
      const formData = this.prepareFormData(this.userForm.value);
      this.userservice.postData(formData).subscribe({
        next: (res) => {
          console.log('Form Submitted Successfully');
          window.alert('Successfully Submitted!');
          this.location.back();
        },
        error: (e) => {
          console.log('Error Occured');
        },
      });
    } else {
      this.userForm.markAllAsTouched();
      this.logValidationErrors(this.userForm);
      console.log('Form is invalid', this.userForm.value);
    }
  }

  prepareFormData(formValue: any): any {
    const preparedSections = formValue.sections.map((section: any) => {
      const preparedFields = section.fields.map((field: any) => ({
        ...field,
        options:
          field.body === 'multiSelect' || field.body === 'singleSelect'
            ? field.options
            : [],
      }));
      return {
        ...section,
        fields: preparedFields,
      };
    });

    return {
      ...formValue,
      sections: preparedSections,
    };
  }

  getFields(sectionIndex: number): FormArray {
    return this.getSections().at(sectionIndex).get('fields') as FormArray;
  }

  getField(sectionIndex: number, fieldIndex: number): FormGroup {
    return this.getFields(sectionIndex).at(fieldIndex) as FormGroup;
  }

  isMultiSelectOrSingleSelect(field: FormGroup): boolean {
    const bodyControl = field.get('body') as FormControl;
    return (
      bodyControl.value === 'multiSelect' ||
      bodyControl.value === 'singleSelect'
    );
  }
}
