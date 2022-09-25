import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserLogin } from './userLogin';

@Injectable({
  providedIn: 'root',
})
export class LoginUserService {
  constructor(private http: HttpClient) {}

  public onSubmit(userLogin: UserLogin): Observable<any> {
    const url = 'https://jsonplaceholder.typicode.com/posts/';

    return this.http.post<any>(url, userLogin);
  }
}
