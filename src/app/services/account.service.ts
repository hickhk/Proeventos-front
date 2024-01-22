/* eslint-disable prettier/prettier */
import { HttpClient } from '@angular/common/http';
import { NonNullAssert } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { User } from '@app/models/account/User';
import { UserUpdate } from '@app/models/account/UserUpdate';
import { environment } from '@environments/environment';
import { Observable, ReplaySubject, empty, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  private currenctUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currenctUserSource.asObservable();
  baseUrl = `${environment.apiUrl}api/Account/`;
  constructor(private http: HttpClient) {}

  geUser() {
    return this.http.get<UserUpdate>(`${this.baseUrl}getUser`).pipe(take(1));
  }

  register(model: any): Observable<void> {
    return this.http.post<User>(`${this.baseUrl}RegisterUser`, model).pipe(
      take(1),
      map((response: User) =>{
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  public login(model: any): Observable<void>{
    return this.http.post<User>(`${this.baseUrl}login`, model).pipe(
      take(1),
      map((response: User) =>{
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }


  logout(): void {
    localStorage.removeItem('user');
    const usuario = {} as User;
    this.currenctUserSource.next(usuario);
    this.currenctUserSource.complete();
    sessionStorage.clear();
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currenctUserSource.next(user);
  }

  public updateUser(model: UserUpdate): Observable<void> {
    return this.http.put<UserUpdate>(`${this.baseUrl}updateUser`, model).pipe(
      take(1),
      map((user: UserUpdate) =>{
        if (user) {
          if (model.password !== '') this.setCurrentUser(user);
        }
      })
    );
  }

  public uploadImage(file?: File): Observable<UserUpdate> {
    const fileImageUpload = file as File;
    const formData = new FormData();
    formData.append('file', fileImageUpload);
    return this.http
      .post<UserUpdate>(`${this.baseUrl}upload-image`, formData)
      .pipe(take(1));
  }
}
