import type { FormControl, FormGroup } from "@angular/forms";

export type AuthFormGroup = FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
    phoneNumber: FormControl<string>;
}>;
