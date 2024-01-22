/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { Palestrante } from '@app/models/Palestrante';
import { UserUpdate } from '@app/models/account/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.css']
})
export class PerfilDetalheComponent implements OnInit {

  @Output() changeFormValue = new EventEmitter();

  form!: FormGroup;
  userUpdate = {} as UserUpdate;
  palestrante = {} as Palestrante;

  constructor(  private fb: FormBuilder,
    private account: AccountService,
    private palestranteService: PalestranteService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService) { }



  ngOnInit() {
    this.validation();
    this.carregarUsuario();
    this.verificaForm();
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.account.geUser().subscribe({
      next: (user: UserUpdate) => {
        // eslint-disable-next-line no-console
        this.userUpdate = user;
        this.form.patchValue(this.userUpdate);
        this.toaster.success('Usuário carregado com sucesso!', 'Sucesso');
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toaster.error('Erro ao carregar o usuário!', 'Erro');
        this.router.navigate(['/dashboard']);
      },
      complete: () => this.spinner.hide(),
    });
  }

  get f(): any {
    return this.form.controls;
  }

  private validation(): void {
    this.form = this.fb.group(
      {
        userName: [''],
        userId: [''],
        titulo: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        description: [''],
        imageUrl: [''],
        funcao: ['', Validators.required],
        password: ['', Validators.minLength(4)],
        confirmPassword: ['', Validators.nullValidator],
      },
      { validator: ValidatorField.MustMatch('password', 'confirmPassword') }
    );
  }

  onsubmit(): void {
    this.atualizarUsuario();
  }

  atualizarUsuario() {

   if(this.f.funcao.value === 'Palestrante'){

      this.palestrante.userId = this.userUpdate.userId;
      this.palestranteService.post(this.palestrante).subscribe();
   }
    this.userUpdate = { ...this.form.value };
   // this.userUpdate.userName = user.userName;
    this.spinner.show();
    this.account.updateUser(this.userUpdate).subscribe({
      next: () => {
        this.toaster.success('Usuário atualizado com sucesso!', 'Sucesso');
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toaster.error('Erro ao atualizar o usuário!', 'Erro');
        console.error(error);
      },
      complete: () => this.spinner.hide(),
    });
  }

  public formReset(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  verificaForm(): void {
    this.form.valueChanges.subscribe(() => this.changeFormValue.emit({...this.form.value}));
  }

}
