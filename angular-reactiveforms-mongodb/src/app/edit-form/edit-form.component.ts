import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  providers: [UserService],
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService
  ) {
    this.editForm = this.fb.group({
      formTitle: ['', Validators.required],
      sections: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService.getFormData(id).subscribe(res => {
      const data = res.data;
      this.editForm.patchValue({ formTitle: data.formTitle });
      this.setSections(data.sections);
    });
  }

  setSections(sectionsData: any[]) {
    if (!sectionsData) {
      console.error('Sections data is undefined or null');
      return;
    }
  
    const sections = sectionsData.map(section => {
      return this.fb.group({
        sectionTitle: [section.sectionTitle || ''],
        fields: this.fb.array(this.setFields(section.fields || []))
      });
    });
  
    this.editForm.setControl('sections', this.fb.array(sections));
  }
  
  setFields(fieldsData: any[]): FormGroup[] {
    if (!fieldsData) {
      console.error('Fields data is undefined or null');
      return [];
    }
  
    return fieldsData.map(field => {
      return this.fb.group({
        title: [field.title || ''],
        body: [field.body || ''],
        value: [field.value || ''],
        options: this.fb.array(field.options ? field.options.map((option: any) => this.fb.control(option)) : []),
        require: [field.require || false],
        showCard: [field.showCard || false],
        unique: [field.unique || false]
      });
    });
  }
  

  isFieldRequired(field: any): Validators | null {
    if (field.body !== 'multiSelect' && field.body !== 'singleSelect') {
      return Validators.required;
    }
    return null;
  }

  getSections(): FormArray {
    return this.editForm.get('sections') as FormArray;
  }

  getFields(index: number): FormArray {
    return this.getSections().at(index).get('fields') as FormArray;
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
      body: ['text', Validators.required],
      value: [{value:'',disabled: true}],
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

  removeOption(sectionIndex: number, fieldIndex: number, optionIndex: number): void {
    const field = this.getField(sectionIndex, fieldIndex);
    (field.get('options') as FormArray).removeAt(optionIndex);
  }

  onsubmit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (this.editForm.valid) {
      const formData = this.prepareFormData(this.editForm.value);
      console.log('Form is valid', formData);
      this.userService.putData(formData, id).subscribe(() => this.goBack());
    } else {
      this.editForm.markAllAsTouched();
      console.log('Form is invalid', this.editForm.value);
    }
  }

  prepareFormData(formValue: any): any {
    const preparedSections = formValue.sections.map((section: any) => {
      const preparedFields = section.fields.map((field: any) => ({
        ...field,
        options: field.body === 'multiSelect' || field.body === 'singleSelect' ? field.options : [],
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

  goBack(): void {
    this.location.back();
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
