import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private fb = inject(FormBuilder);

  jobForm = this.fb.group({
    personalInfo: this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?\d{10,}$/)]],
    }),
    education: this.fb.array([
      this.createEducationGroup()
    ]),
    experience: this.fb.array([
      this.createExperienceGroup()
    ]),
    references: this.fb.array([]),
    agreements: this.fb.group({
      terms: [false, Validators.requiredTrue],
      gdprConsent: [false],
    }),
  });


  // Education STARTS **********************************************************

  get education() {
    return this.jobForm.get('education') as FormArray;
  }

  createEducationGroup(): FormGroup {
    return this.fb.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      startYear: ['', [Validators.required, Validators.min(1900)]],
      endYear: ['', [Validators.required, Validators.min(1900)]],
    }, { validators: this.yearRangeValidator });
  }

  addEducation() {
    this.education.push(this.createEducationGroup());
  }

  removeEducation(index: number) {
    this.education.removeAt(index);
  }

  // Custom cross-field validator
  yearRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startYear')?.value;
    const end = group.get('endYear')?.value;
    return start && end && start >= end ? { yearRange: true } : null;
  }

  // Education ENDS **********************************************************

  // Experience STARTS **********************************************************

  get experience(): FormArray {
    return this.jobForm.get('experience') as FormArray;
  }

  createExperienceGroup(): FormGroup {
    return this.fb.group({
      companyName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      responsibilities: this.fb.array([
        this.fb.control('', Validators.required)
      ])
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return startDate <= endDate ? null : { dateRange: true };
  };

  addExperience(): void {
    this.experience.push(this.createExperienceGroup());
  }

  removeExperience(index: number): void {
    this.experience.removeAt(index);
  }

  getResponsibilities(experienceIndex: number): FormArray<FormControl> {
    return this.experience.at(experienceIndex).get('responsibilities') as FormArray<FormControl>;
  }


  addResponsibility(index: number): void {
    this.getResponsibilities(index).push(this.fb.control('', Validators.required));
  }

  removeResponsibility(expIndex: number, resIndex: number): void {
    this.getResponsibilities(expIndex).removeAt(resIndex);
  }

  // Experience ENDS **********************************************************

  submit() {
    debugger;
    console.log(this.jobForm.value);
  }

}
