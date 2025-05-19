# Angular Reactive Forms Learning

## In design, how did we handle the red color of the text box and also its border color ?

### 1. **Border Color Change on Invalid Input**

```css
input.ng-invalid.ng-touched {
  border-color: #dc3545;       /* Red border for invalid & touched input */
  background-color: #fff5f5;   /* Light red background to highlight error */
}
```

* **`ng-invalid`**: Angular adds this CSS class to any form control whose value fails validation.
* **`ng-touched`**: This class is added after the user focuses and then leaves (blurs) the input.
* The selector `input.ng-invalid.ng-touched` targets only inputs that are **invalid and have been interacted with** to avoid showing errors before user interaction.

---

### 2. **Error Text Color**

```css
span,
div[style*='color: red'] {
  color: red;
  font-size: 14px;
  margin-top: 6px;
  display: block;
}
```

* The validation error messages use `color: red` explicitly to stand out and grab user attention.
* They’re also spaced and sized for clarity and accessibility.

---

### Summary:

* The **red border** and **light red background** visually mark invalid fields.
* The **red error message text** below inputs tells the user what exactly went wrong.
* This feedback appears only **after user interaction** (`.ng-touched`), so the form doesn’t show errors on page load.

---

## ist of all the classes that angular reactive forms use.

Sure! Angular’s Reactive Forms automatically add and remove **CSS classes** on form controls to help you style them based on their state. These classes are added dynamically by Angular to track control status and user interaction.

Here are the **main CSS classes Angular Reactive Forms use** on form controls (like `<input>`, `<select>`, `<textarea>`):

---

### Angular Reactive Forms CSS Classes

| Class Name         | Description                                                                         |
| ------------------ | ----------------------------------------------------------------------------------- |
| `ng-valid`         | Applied when the control’s current value **passes all validation** rules.           |
| `ng-invalid`       | Applied when the control’s current value **fails at least one validation** rule.    |
| `ng-pending`       | Applied while async validation is running (e.g., server-side validation).           |
| `ng-pristine`      | Applied when the control has **not been changed** by the user since initialization. |
| `ng-dirty`         | Applied when the control’s value **has been changed** by the user.                  |
| `ng-untouched`     | Applied when the control **has not been blurred (left)** yet.                       |
| `ng-touched`       | Applied when the control **has been blurred (left)** by the user.                   |
| `ng-submitted`     | Applied on the form element when the form has been submitted.                       |
| `ng-async-valid`   | (Less commonly used) Applied if async validation passes.                            |
| `ng-async-invalid` | (Less commonly used) Applied if async validation fails.                             |

---

### How These Classes Work

* Angular toggles these classes **automatically** based on the control's state.
* You can use these classes in CSS selectors to style inputs differently depending on validation or user interaction.
* For example, `.ng-invalid.ng-touched` means the input is invalid and the user has already touched (focused and blurred) it, so you usually show error messages then.

---

### Example CSS Selectors Using These Classes

```css
input.ng-invalid.ng-touched {
  border-color: red;
  background-color: #fff5f5;
}

input.ng-valid.ng-touched {
  border-color: green;
}
```

---

### Note

These classes are attached to **individual form controls** (`FormControl`), but some also appear on **form groups** and **forms** (`FormGroup`, `FormArray`, and `FormGroupDirective`) at the form level.

---

## ✅ **Angular Reactive Form Classes — Use Cases**

---

### 🔹 `ng-untouched`

**📌 Meaning:** The user **has not focused and blurred** (i.e., "touched") the input.

**✅ Use Case:**

* Prevent showing validation errors **until the user has interacted**.

**💡 Example:**

```css
input.ng-untouched {
  background-color: #fff; /* default */
}
```

```html
<!-- Do NOT show error before touched -->
<div *ngIf="control.invalid && control.touched">
  This field is required.
</div>
```

---

### 🔹 `ng-touched`

**📌 Meaning:** The user **focused and then blurred** the input.

**✅ Use Case:**

* Trigger **error messages only after the user has interacted** with a field.

**💡 Example:**

```css
input.ng-touched.ng-invalid {
  border-color: red;
}
```

```html
<div *ngIf="control.touched && control.invalid">
  Please fix this field.
</div>
```

---

### 🔹 `ng-pristine`

**📌 Meaning:** The input value **has not been changed** since initialization.

**✅ Use Case:**

* Detect **"clean" forms** that haven't been edited.
* Disable submit buttons when the form is still pristine.

**💡 Example:**

```html
<button [disabled]="form.pristine">Submit</button>
```

---

### 🔹 `ng-dirty`

**📌 Meaning:** The value has been **modified**.

**✅ Use Case:**

* Enable "Save" or "Update" buttons only if the form has been changed.
* Show “Unsaved changes” warning if the user tries to navigate away.

**💡 Example:**

```ts
@HostListener('window:beforeunload')
canUnload() {
  return !this.form.dirty;
}
```

```html
<button [disabled]="!form.dirty">Save Changes</button>
```

---

### 🔹 `ng-valid`

**📌 Meaning:** The control has **passed all validators**.

**✅ Use Case:**

* Add green borders, checkmarks, or feedback icons.
* Allow form submission only when valid.

**💡 Example:**

```css
input.ng-valid.ng-touched {
  border: 2px solid green;
}
```

```html
<button [disabled]="form.invalid">Submit</button>
```

---

### 🔹 `ng-invalid`

**📌 Meaning:** The control **failed at least one validator**.

**✅ Use Case:**

* Show red borders or inline error messages.

**💡 Example:**

```css
input.ng-invalid.ng-touched {
  border-color: red;
}
```

```html
<div *ngIf="control.invalid && control.touched">
  Invalid input.
</div>
```

---

### 🔹 `ng-pending`

**📌 Meaning:** The control is **waiting for an async validator** to finish.

**✅ Use Case:**

* Show a spinner or "Validating..." message.
* Prevent form submission until async validation completes.

**💡 Example:**

```css
input.ng-pending {
  background-image: url('/assets/spinner.gif');
  background-repeat: no-repeat;
  background-position: right center;
}
```

```html
<div *ngIf="control.pending">
  Validating...
</div>
```

---

### 🔹 `ng-submitted` (applied to `<form>` only)

**📌 Meaning:** The user **submitted the form**.

**✅ Use Case:**

* Force display of all error messages.
* Disable form after submission.
* Add confirmation styling.

**💡 Example:**

```ts
onSubmit(form: FormGroup) {
  this.submitted = true;
  if (form.invalid) return;
  // proceed
}
```

```css
form.ng-submitted input.ng-invalid {
  border-color: red;
}
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit(form)">
  <button type="submit">Submit</button>
</form>
```

---

## 🧠 Summary Table of Use Cases

| Class          | Use Case                                        |
| -------------- | ----------------------------------------------- |
| `ng-untouched` | Hide error messages until user touches field    |
| `ng-touched`   | Show validation only after user interaction     |
| `ng-pristine`  | Disable actions if form hasn’t been touched     |
| `ng-dirty`     | Trigger "Save changes", warn on unsaved changes |
| `ng-valid`     | Show success styles or icons                    |
| `ng-invalid`   | Highlight errors and prevent submission         |
| `ng-pending`   | Show loaders during async validation            |
| `ng-submitted` | Display errors on all fields after submit       |

---
