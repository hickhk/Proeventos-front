import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {
  constructor(private router: Router, private toaster: ToastrService){}

  canActivate(): boolean {
    if (localStorage.getItem('user') !== null) return true;

    this.toaster.info('Usuário não autenticado!');
    this.router.navigateByUrl('/user/login');
    return false;
  }

}