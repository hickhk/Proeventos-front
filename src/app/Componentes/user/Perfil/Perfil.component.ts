/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/account/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { environment } from '@environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-Perfil',
  templateUrl: './Perfil.component.html',
  styleUrls: ['./Perfil.component.css'],
})

export class PerfilComponent implements OnInit {
  public usuario = {} as UserUpdate;




  constructor(
    private account: AccountService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  userUpdate = {} as UserUpdate;
  file = {} as File;
  imageUrl = '';

  ngOnInit() {

  }

  get f(): any {
    return '';
  }

  public getFormValue(usuario: UserUpdate): void{
    this.usuario = usuario;
    if(usuario.imageUrl)
      this.imageUrl = environment.apiUrl + `Resources/Images/users/${usuario.imageUrl}`;
    else
    this.imageUrl = './assets/images/user.jpg';
  }

  public get ePalestrante(): boolean{
    return this.usuario.funcao === 'Palestrante';
  }


  public onFileChange(event: any): void {
    const reader = new FileReader();
    this.file = event.target.files[0];

    reader.onload = (event: any) => (this.imageUrl = event.target.result);

    reader.readAsDataURL(this.file);

    this.uploadImage();
  }

  private uploadImage(): void {
    this.spinner.show();
    this.account
      .uploadImage(this.file)
      .subscribe({
        next: () => {
          //this.carregarUsuario();
          this.toaster.success('Imagem atualizada com sucesso!', 'Sucesso');
        },
        error: (error: any) => {
          this.toaster.error('Erro ao tentar enviar a nova imagem', 'Erro');
          console.error(error);
        },
      })
      .add(() => this.spinner.hide());
  }
}
