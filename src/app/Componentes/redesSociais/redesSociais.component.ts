/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RedeSocial } from '@app/models/RedeSocial';
import { AccountService } from '@app/services/account.service';
import { RedeSocialService } from '@app/services/redeSocial.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-redesSociais',
  templateUrl: './redesSociais.component.html',
  styleUrls: ['./redesSociais.component.css']
})
export class RedesSociaisComponent implements OnInit {

  public formRedeSocial!: FormGroup;
  public redeSocialAtual = {id: 0, nome: '', indice: 0 };
  modalRef: BsModalRef | undefined;

  @Input() eventoId = 0;


  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private account: AccountService,
    private redeSocialService: RedeSocialService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.validation();

    if(this.eventoId ===0){
      this.carregarredesSociais('palestrante');
    }else{
      this.carregarredesSociais('evento',this.eventoId);
    }
  }

  public validation(): void {
    this.formRedeSocial = this.fb.group({
      redesSociais: this.fb.array([]),
    });
  }

  get redesSociais(): FormArray {
    return this.formRedeSocial.get('redesSociais') as FormArray;
  }

  get f(): any {
    return this.formRedeSocial.controls;
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null): any {
    return {
      'is-invalid': campoForm?.errors && (campoForm.dirty || campoForm.touched),
    };
  }

  public retornaTitulo(redeSocial: any): string {
    return redeSocial === null || redeSocial.controls.nome.value === '' ? 'Nome da Rede Social' : redeSocial.controls.nome.value;
  }

  public adicionarRedeSocial(): void {
    this.redesSociais.push(this.criaRedeSocial({ id: 0 } as RedeSocial));
  }

  criaRedeSocial(RedeSocial: RedeSocial): FormGroup {
    return this.fb.group({
      id: [RedeSocial.id],
      nome: [RedeSocial.nome, Validators.required],
      url: [RedeSocial.url, Validators.required],
    });
  }

  SalvarRedeSocial(): void {

    const origem = (this.eventoId === 0) ? 'palestrante': 'evento';

    this.spinner.show();
    if (this.formRedeSocial.status === 'VALID') {
      this.redeSocialService
        .SaveRedeSocial(origem, this.eventoId, this.formRedeSocial.value.redesSociais)
        .subscribe({
          next: (RedeSocial: RedeSocial[]) => {
            this.toaster.success('RedeSocial salva com sucesso!', 'Sucesso');
          },
          error: (error: any) => {
            this.toaster.error('Erro ao salvar a Rede Social!', 'Error');
            console.error(error);
          },
        })
        .add(() => this.spinner.hide());
    }
  }

  public removerRedeSocial(template: TemplateRef<any>, indice: number): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.redeSocialAtual.indice = indice;
    this.redeSocialAtual.id = this.redesSociais.get(indice + '.id')?.value;
    this.redeSocialAtual.nome = this.redesSociais.get(indice + '.nome')?.value;
  }

  public carregarredesSociais(origem: string, id  = 0): void {
      this.spinner.show();
      this.redesSociais.clear();
      this.redeSocialService
        .GetRedesSociais(origem, id)
        .subscribe({
          next: (redesSociaisRetorno: RedeSocial[]) => {
            redesSociaisRetorno.forEach((RedeSocial) => {
              this.redesSociais.push(this.criaRedeSocial(RedeSocial));
            });
          },
          error: (error: any) => {
            this.toaster.error('Erro ao tentar recuperar a rede social', 'Erro');
            console.error(error);
          },
        })
        .add(() => this.spinner.hide());
  }

  public confirmDeleteRedeSocial(): void {

    const origem = (this.eventoId === 0) ? 'palestrante': 'evento';

    this.spinner.show();
    if (this.formRedeSocial.status === 'VALID') {
      this.redeSocialService
        .deleteRedeSocial(origem, this.eventoId, this.redeSocialAtual.id)
        .subscribe({
          next: (RedeSocial: RedeSocial[]) => {
            this.toaster.success('RedeSocial deletada com sucesso!', 'Sucesso');
            this.redesSociais.removeAt(this.redeSocialAtual.indice);
          },
          error: (error: any) => {
            this.toaster.error('Erro ao deletar a Rede Social!', 'Error');
            console.error(error);
          },
        })
        .add(() => this.spinner.hide());
    }
    this.modalRef?.hide();
  }

  public declineDeleteRedeSocial(): void {
    this.modalRef?.hide();
  }
}
