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

  constructor(private fb: FormBuilder, public userservice: UserService) {}
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
      value: [{ value: '', disabled: false }],
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

  submit(): void {
    // if (this.userForm.valid) {
    //   console.log(this.userForm.value);
    // } else {
    //   this.userForm.markAllAsTouched();
    //   console.log('Form is invalid');
    // }
    //console.log(this.userForm.value);
    this.userservice.postData(this.userForm.value);
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
