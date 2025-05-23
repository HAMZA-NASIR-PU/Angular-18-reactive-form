import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  userForm!: FormGroup;
  myControl!: FormControl;

  constructor(private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.formBuilder.group(
        {
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required]
        },
        {
          validators: this.passwordMatchValidator  // Set the group-level validator here.
        }
      ),
      address: this.formBuilder.group({
        street: ['', Validators.required],
        city: ['', Validators.required]
      }),
      phoneNumbers: this.formBuilder.array([
        this.formBuilder.control('', [Validators.required, Validators.pattern(/^\d{10}$/)])
      ], { validators: this.atLeastOnePhoneNumberValidator }),
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  get phoneNumbers(): FormArray {
    return this.userForm.get('phoneNumbers') as FormArray;
  }

  addPhoneNumber() {
    this.phoneNumbers.push(
      this.formBuilder.control('', [Validators.required, Validators.pattern(/^\d{10}$/)])
    );
  }

  removePhoneNumber(index: number) {
    this.phoneNumbers.removeAt(index);
  }

  atLeastOnePhoneNumberValidator(formArray: AbstractControl): ValidationErrors | null {
    return (formArray as FormArray).length > 0 ? null : { noPhone: true };
  }

  submitForm() {
    debugger;
    console.log(`Valid: ${this.userForm.valid}`);

    console.log(this.userForm.getRawValue());
  }

}
