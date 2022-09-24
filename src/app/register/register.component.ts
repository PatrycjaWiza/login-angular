import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
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
  pathMobile: string = '../assets/images/yanosik-logo-mobile.png';
  pathDesktop: string = '../assets/images/yanosik-logo-desktop.png 800w';
  user: User;
  users: User[] = [];

  // checkboxes select all
  checkboxes = [
    {
      id: 'defaultCheck2',
      name: 'Zapoznałem/am się z Regulaminem',
      select: false,
      required: true,
    },
    {
      id: 'defaultCheck3',
      name: 'Zapoznałem/am się z Polityką Prywatności',
      select: false,
      required: true,
    },
    {
      id: 'defaultCheck4',
      name: 'Wyrażam zgodę na przetwarzanie moich danych w celach marketingowych',
      select: false,
      required: false,
    },
  ];

  onChangeCheckbox($event) {
    const id = $event.target.id;
    const isChecked = $event.target.checked;
    console.log($event.target.ngClass);
    this.checkboxes.map((box) => {
      if (id === box.id) {
        this.parentSelector = false;
        return (box.select = isChecked);
      }
      if (id === 'defaultCheck1') {
        box.select = this.parentSelector;
        return box;
      }
      return;
    });
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
        defaultCheck2: new FormControl(null, [Validators.required]),
        defaultCheck3: new FormControl(null, [Validators.required]),
        defaultCheck4: '',
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

  onSubmit() {
    this.submitted = true;
    if (this.reactiveForm.invalid) {
      return;
    } else {
      this.user = this.reactiveForm.value;
      this.userService.onSubmit(this.user).subscribe((response: any) => {
        alert('Rejestracja przebiegła pomyślne!');
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
          alert('Coś poszło nie tak... Spróbuj ponownie!');
        };
    }
  }

  ngOnInit(): void {}
}
