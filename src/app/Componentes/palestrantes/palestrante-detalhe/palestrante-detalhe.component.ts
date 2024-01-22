/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, tap } from 'rxjs';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.css']
})
export class PalestranteDetalheComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private palestranteService: PalestranteService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
  ) { }

  form!: FormGroup;
  public corDescricao = '';
  public situacaoForm = '';

  ngOnInit() {
    this.validation();
    this.verifyForm();
    this.carregaPalestrante();
  }

  private carregaPalestrante(): void{
    this.spinner.show();
    this.palestranteService
              .getPalestrante()
              .subscribe((palestrante: Palestrante) =>
                    {
                      this.form.patchValue(palestrante);
                    },
                    (error: any) => {
                      this.toaster.error('Erro ao carregar minicurrículo!', 'Error');
                      console.error(error);
                    },
                ).add(() => this.spinner.hide());

  }


  verifyForm(): void {
    this.form.valueChanges
             .pipe(
              map(() =>{
                this.situacaoForm = 'Minicurrículo está sendo Atualizado!'
                this.corDescricao = 'text-warning'
              }),
              debounceTime(2000),
             // tap(() => this.spinner.show()),
             ).subscribe(() =>{

              this.palestranteService
              .put({... this.form.value})
              .subscribe(() =>
                    {
                    this.situacaoForm = 'Minicurrículo foi Atualizado!'
                    this.corDescricao = 'text-success'

                    setTimeout(()=>{
                      this.situacaoForm = 'Minicurrículo foi carregado!'
                      this.corDescricao = 'text-muted'
                    },2000);
                    },
                    (error: any) => {
                      this.toaster.error('Erro ao atualizar o minicurrículo!', 'Error');
                      console.error(error);
                    },
                );//.add(() => this.spinner.hide());
              });
  }

  validation(): void {
    this.form = this.fb.group({
      miniCurriculo:['']
    });
  }

  get f(): any {
    return this.form.controls;
  }

}
