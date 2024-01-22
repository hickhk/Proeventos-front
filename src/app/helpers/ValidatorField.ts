import { AbstractControl, FormGroup } from "@angular/forms";

export class ValidatorField {
  static MustMatch(controlName: string, matchingControlName: string): any{
    return (group: AbstractControl) =>{
      const formGroup = group as FormGroup;
      const control = formGroup.controls[controlName];
      const matchingColtrol = formGroup.controls[matchingControlName];

      if (control.value !== matchingColtrol.value){
          matchingColtrol.setErrors({mustMatch: true});
      }else{
        matchingColtrol.setErrors(null);
      }
    }
  }
}
