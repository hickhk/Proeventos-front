/* eslint-disable prettier/prettier */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models/account/User';
import { AccountService } from '@app/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent  {

  isCollapsed = true;
  user = {} as User;

  constructor(private router: Router, public account: AccountService) {}

  ngOnInit() {
    this.user = {} as User;
    if (localStorage.getItem('user')) {
      const value = window.localStorage.getItem('user') as string;
      this.user = JSON.parse(value) ?? '{}';
    } else {
      this.user = {} as User;
    }
  }

  logout() {
    this.account.logout();
    this.router.navigateByUrl('user/login');
  }

  showMenu(): boolean {
    return this.router.url !== '/user/login';
  }
}
