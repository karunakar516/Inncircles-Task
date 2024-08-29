import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { UserService } from '../user.service';
import * as Handlebars from 'handlebars';
import { jsPDF } from 'jspdf';
@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  providers: [UserService],
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
})
export class EditFormComponent implements OnInit {
  editForm: FormGroup;
  dataObject: any;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService
  ) {
    this.editForm = this.fb.group({
      formTitle: ['', Validators.required],
      sections: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService.getFormData(id).subscribe((res) => {
      const data = res.data;
      this.dataObject = data;
      this.editForm.patchValue({ formTitle: data.formTitle });
      this.setSections(data.sections);
    });
  }

  setSections(sectionsData: any[]) {
    if (!sectionsData) {
      console.error('Sections data is undefined or null');
      return;
    }

    const sections = sectionsData.map((section) => {
      return this.fb.group({
        sectionTitle: [section.sectionTitle || ''],
        fields: this.fb.array(this.setFields(section.fields || [])),
      });
    });

    this.editForm.setControl('sections', this.fb.array(sections));
  }

  setFields(fieldsData: any[]): FormGroup[] {
    if (!fieldsData) {
      console.error('Fields data is undefined or null');
      return [];
    }

    return fieldsData.map((field) => {
      return this.fb.group({
        title: [field.title || ''],
        body: [field.body || ''],
        value: [field.value || ''],
        options: this.fb.array(
          field.options
            ? field.options.map((option: any) => this.fb.control(option))
            : []
        ),
        require: [field.require || false],
        showCard: [field.showCard || false],
        unique: [field.unique || false],
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

  onsubmit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (this.editForm.valid) {
      const formData = this.prepareFormData(this.editForm.value);
      //console.log('Form is valid', formData);
      window.alert('Form Edited Successfully!');
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
  downloadPDF() {
    const template = `
      <div style="align-items:center; margin: 0; padding: 0;">
  <p style="font-size: 10px; margin: 2px; padding: 0;">{{formTitle}}</p>
  {{#each sections}}
    <p style="font-size: 6px; margin: 2px; padding: 0;">Section_Title: {{sectionTitle}}</p>
    <div>
      {{#each fields}}
        <p style="font-size: 4px; margin: 2px; padding: 0;">Field: {{title}}</p>
        <p style="font-size: 4px; margin: 2px; padding: 0;">Body: {{body}}</p>
        {{#each options}}
          <div style="display:flex; margin: 0; padding: 0;">
            <p style="font-size: 4px; margin: 2px; padding: 0;">Option: {{this}}</p>
          </div>
        {{/each}}
        <p style="font-size: 4px; margin: 2px; padding: 0;">Required: {{require}}</p>
        <p style="font-size: 4px; margin: 2px; padding: 0;">Unique: {{unique}}</p>
        <p style="font-size: 4px; margin: 2px; padding: 0;">Show On Card: {{showCard}}</p>
        <hr style="margin: 4px 0; padding: 0;">
      {{/each}}
    </div>
    <hr style="margin: 4px 0; padding: 0;">
  {{/each}}
</div>`;

    const compiledTemplate = Handlebars.compile(template);
    const htmlContent = compiledTemplate(this.dataObject);

    this.generatePDF(htmlContent);
  }

  generatePDF(htmlContent: string) {
    const doc = new jsPDF();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    document.body.appendChild(tempDiv);

    doc.html(tempDiv, {
      callback: (doc) => {
        doc.save('document.pdf');
        document.body.removeChild(tempDiv);
      },
      x: 10,
      y: 10,
    });
  }
}
