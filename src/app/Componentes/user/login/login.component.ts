/* eslint-disable prettier/prettier */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLogin } from '@app/models/account/UserLogin';
import { AccountService } from '@app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  model = {} as UserLogin;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
   sessionStorage.clear();
  }

  public login(): void {
    this.accountService.login(this.model).subscribe(
      () => {
        //this.router.navigateByUrl('/dashboard');
        location.href ='/home';
      },
      (error: any) => {
        if (error.staus == 401)
          this.toaster.error('Usuário ou senha invalidos!');
        else console.error(error);
      }
    );
  }
}
