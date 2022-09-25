import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { UserService } from './userService';
import { User } from './user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  parentSelector: boolean = false;
  reactiveForm: FormGroup;
  submitted: boolean = false;
  pathMobile: string = 'assets/images/yanosik-logo-mobile.png';
  pathDesktop: string = 'assets/images/yanosik-logo-desktop.png 800w';
  user: User;
  users: User[] = [];

  // checkboxes array
  checkboxes: Array<any> = [
    {
      name: 'Zapoznałem/am się z Regulaminem',
      value: 'Zapoznałem/am się z Regulaminem',
      select: false,
    },
    {
      name: 'Zapoznałem/am się z Polityką Prywatności',
      value: 'Zapoznałem/am się z Polityką Prywatności',
      select: false,
    },
    {
      name: 'Wyrażam zgodę na przetwarzanie moich danych w celach marketingowych',
      value:
        'Wyrażam zgodę na przetwarzanie moich danych w celach marketingowych',
      select: false,
    },
  ];

  //checkboxes select all
  onChangeCheckbox(e) {
    const isChecked = e.target.checked;
    const id = e.target.id;

    const checkArray: FormArray = this.reactiveForm.get(
      'checkArray'
    ) as FormArray;

    this.checkboxes.map((box, i) => {
      if (i == id) {
        this.parentSelector = false;
        return (box.select = isChecked);
      }
      if (id == 'defaultCheck1') {
        box.select = this.parentSelector;
        if (box.select == true) {
          checkArray.push(new FormControl(e.target.value));
        }
        if (box.select == false) {
          checkArray.removeAt(id);
        }
        return box;
      }

      //validation checkbox trial
      if (e.target.checked) {
        checkArray.push(new FormControl(e.target.value));
      } else {
        let i = 0;
        checkArray.controls.forEach((item) => {
          if (item.value == e.target.value) {
            checkArray.removeAt(i);
            return;
          }
          i++;
        });
      }
    });
    return;
  }

  constructor(
    private formBuilder: FormBuilder,
    public userService: UserService
  ) {
    this.reactiveForm = this.formBuilder.group(
      {
        email: new FormControl(null, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        passwordRepeat: new FormControl(null, [Validators.required]),
        checkArray: this.formBuilder.array([], [Validators.required]),
      },
      {
        validators: this.MatchCheck('password', 'passwordRepeat'),
      }
    );
  }

  get f() {
    return this.reactiveForm.controls;
  }

  MatchCheck(nameControl: string, confirmNameControl: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[nameControl];
      const matchControl = formGroup.controls[confirmNameControl];
      if (matchControl.errors && !matchControl.errors.matchCheck) {
        return;
      }
      if (control.value !== matchControl.value) {
        matchControl.setErrors({ matchCheck: true });
      } else {
        matchControl.setErrors(null);
      }
    };
  }

  // post http request - form submission
  onSubmit() {
    this.submitted = true;
    if (this.reactiveForm.invalid) {
      return;
    } else {
      this.user = this.reactiveForm.value;
      this.userService.onSubmit(this.user).subscribe((response: any) => {
        window.alert('Rejestracja przebiegła pomyślne!');
        this.users.push({
          email: response.email,
          password: response.password,
          passwordRepeat: response.passwordRepeat,
          checkbox1: response.defaultCheck2,
          checkbox2: response.defaultCheck3,
          checkbox3: response.defaultCheck3,
        });
        this.reactiveForm.reset();
      }),
        (error) => {
          window.alert('Coś poszło nie tak... Spróbuj ponownie!');
        };
    }
  }

  ngOnInit(): void {}
}
