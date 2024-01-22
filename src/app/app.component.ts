/* eslint-disable prettier/prettier */
import { Component } from '@angular/core';
import { AccountService } from './services/account.service';
import { User } from './models/account/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private accountService: AccountService){}

  ngOnInit(): void {
    this.setCurrentUser();
  }
  setCurrentUser() {
    let user = {} as User;

    if (localStorage.getItem('user')) {
      const value = window.localStorage.getItem('user') as string;
      user = JSON.parse(value) ?? '{}';
    } else {
      user = {} as User;
    }

    if (user) this.accountService.setCurrentUser(user);
  }
  value(value: any): User {
    throw new Error('Method not implemented.');
  }

  title = 'ProEventos-App';
}
