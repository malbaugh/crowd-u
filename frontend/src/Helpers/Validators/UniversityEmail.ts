import { AbstractControl } from '@angular/forms';

export function ValidateUniversityEmail(control: AbstractControl) {
    let email = control.value;
    if (email.length <= 0) {
        return null;
    }
    if (!email.includes(".edu")) {
        return { universityEmail: true };
    }
    return null;
}
