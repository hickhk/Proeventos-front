/* eslint-disable prettier/prettier */
import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { environment } from '@environments/environment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.css'],
})
export class EventoDetalheComponent implements OnInit {
  modalRef: BsModalRef | undefined;
  formDetalhe!: FormGroup;
  evento = {} as Evento;
  loteAtual = { indice: 0, id: 0, nome: '' };
  eventoStatus = {} as string;
  eventoId: any;
  loteId?: number;
  imageUrl = '../../../../assets/images/Nova pasta/cloud-upload.png';
  file = {} as File;

  constructor(
    private fb: FormBuilder,
    private bsLocaleService: BsLocaleService,
    private modalService: BsModalService,
    private ActivatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private router: Router
  ) {
    this.bsLocaleService.use('pt-br');
  }

  ngOnInit() {
    this.validation();
    this.carregarEvento();
    this.eventoStatus = this.ActivatedRouter.snapshot.paramMap.get('id')
      ? 'put'
      : 'post';
  }

  get editarEvento(): boolean {
    if (this.eventoStatus === 'put') {
      return true;
    } else {
      return false;
    }
  }

  get f(): any {
    return this.formDetalhe.controls;
  }

  get lotes(): FormArray {
    return this.formDetalhe.get('lotes') as FormArray;
  }

  public validation(): void {
    this.formDetalhe = this.fb.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(10000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imageUrl: [''],
      lotes: this.fb.array([]),
    });
  }

  public adicionarLote(): void {
    this.lotes.push(this.criaLote({ id: 0 } as Lote));
  }

  criaLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  public formReset(event: any): void {
    event.preventDefault();
    this.formDetalhe.reset();
  }

  SalvarEvento(): void {
    const action = this.ActivatedRouter.snapshot.paramMap.get('id')
      ? 'put'
      : 'post';

    if (this.formDetalhe.valid) {
      this.evento =
        action === 'post'
          ? { ...this.formDetalhe.value }
          : { id: this.evento.id, ...this.formDetalhe.value };
      this.spinner.show();
      this.eventoService[action](this.evento)
        .subscribe({
          next: (evento: Evento) => {
            const novoEvento = Object.create(evento);
            this.toaster.success('Evento salvo com sucesso!', 'Sucesso');
            this.router.navigate([`eventos/detalhe/${novoEvento.evento.id}`]);
          },
          error: (error: any) => {
            this.toaster.error('Erro ao salvar o evento!', 'Error');
            console.error(error);
          },
        })
        .add(() => this.spinner.hide());
    }
  }

  SalvarLotes(): void {
    this.spinner.show();
    if (this.lotes.status === 'VALID') {
      this.loteService
        .saveLotes(this.evento.id, this.lotes.value)
        .subscribe({
          next: (lote: Lote[]) => {
            this.toaster.success('Lote salvo com sucesso!', 'Sucesso');
            //this.lotes.reset();
            this.router.navigate([`eventos/detalhe/${this.evento.id}`]);
          },
          error: (error: any) => {
            this.toaster.error('Erro ao salvar os lotes!', 'Error');
            console.error(error);
          },
        })
        .add(() => this.spinner.hide());
    }
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null): any {
    return {
      'is-invalid': campoForm?.errors && (campoForm.dirty || campoForm.touched),
    };
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  get bsConfigLote(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  public carregarEvento(): void {
    this.eventoId = this.ActivatedRouter.snapshot.paramMap.get('id');

    if (this.eventoId !== null || this.eventoId !== null) {
      this.spinner.show();
      this.eventoService
        .getEventoById(this.eventoId)
        .subscribe({
          next: (evento: Evento) => {
            this.evento = { ...evento };
            this.formDetalhe.patchValue(this.evento);
            if (this.evento.imagemUrl !== '') {
              this.imageUrl = `${environment.apiUrl}Resources/Images/${this.evento.imagemUrl}`;
            }
            this.carregarLotes();
          },
          error: (error: any) => {
            this.toaster.error('Erro ao tentar recuperar o evento', 'Erro');
            console.error(error);
          },
        })
        .add(() => this.spinner.hide());
    }
  }

  public carregarLotes(): void {
    if (this.eventoId !== null || this.eventoId !== null) {
      this.spinner.show();
      this.lotes.clear();
      this.loteService
        .GetLotesByEventoId(this.eventoId)
        .subscribe({
          next: (lotesRetorno: Lote[]) => {
            lotesRetorno.forEach((lote) => {
              this.lotes.push(this.criaLote(lote));
            });
          },
          error: (error: any) => {
            this.toaster.error('Erro ao tentar recuperar o evento', 'Erro');
            console.error(error);
          },
        })
        .add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.loteAtual.indice = indice;
    this.loteAtual.id = this.lotes.get(indice + '.id')?.value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome')?.value;
  }

  public confirmDeleteLote(): void {
    if (this.loteAtual !== null && this.loteAtual.id !== 0) {
      this.spinner.show();
      this.loteService
        .deleteLote(this.eventoId, this.loteAtual.id)
        .subscribe({
          next: (result: any) => {
            this.toaster.success('Lote deletado com sucesso!', 'Sucesso');
            this.lotes.removeAt(this.loteAtual.indice);
          },
          error: (error: any) => {
            this.toaster.error(
              `Erro ao tentar deletar o lote ${this.loteAtual.nome}`,
              'Erro'
            );
            console.error(error);
          },
        })
        .add(() => {
          this.spinner.hide();
          this.modalRef?.hide();
        });
    }
  }

  public declineDeleteLote(): void {
    this.modalRef?.hide();
  }

  public retornaTituloLote(nomeLote: string): string {
    return nomeLote === null || nomeLote === '' ? 'Nome do Lote' : nomeLote;
  }

  public onFileChange(event: any): void {
    const reader = new FileReader();
    this.file = event.target.files[0];

    reader.onload = (event: any) => (this.imageUrl = event.target.result);

    reader.readAsDataURL(this.file);

    this.uploadImage();
  }

  uploadImage(): void {
    this.spinner.show();
    this.eventoService
      .uploadImage(this.eventoId, this.file)
      .subscribe({
        next: () => {
          this.carregarEvento();
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
