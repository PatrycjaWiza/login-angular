import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { LoginUserService } from './userServiceLogin';
import { UserLogin } from './userLogin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  reactiveForm: FormGroup;
  submitted: boolean = false;
  pathMobile: string = 'assets/images/yanosik-logo-mobile.png';
  pathDesktop: string = 'assets/images/yanosik-logo-desktop.png 800w';
  userLogin: UserLogin;
  usersLogin: UserLogin[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public loginUserService: LoginUserService
  ) {
    this.reactiveForm = this.formBuilder.group({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  get f() {
    return this.reactiveForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.reactiveForm.invalid) {
      return;
    } else {
      this.userLogin = this.reactiveForm.value;
      this.loginUserService
        .onSubmit(this.userLogin)
        .subscribe((response: any) => {
          window.alert('Użytkownik zalogowany pomyślnie!');
          this.usersLogin.push({
            email: response.email,
            password: response.password,
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
