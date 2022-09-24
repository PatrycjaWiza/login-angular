import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public onSubmit(user: User): Observable<any> {
    const url = 'https://jsonplaceholder.typicode.com/posts/';

    return this.http.post<any>(url, user);
  }
}
