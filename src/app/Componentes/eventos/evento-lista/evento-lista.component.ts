/* eslint-disable prettier/prettier */
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.css'],
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;
  typeSelected: string;
  NULL: any;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.typeSelected = 'ball-fussion';
  }

  public eventos: Evento[] = [];
  public showImages = true;

  public eventoId = 0;
  public itemsPerPage = 1;
  public pagination = {} as Pagination;
  termFilterChanged: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 2,
      totalItems: 1,
    } as Pagination;
    this.getEventos();
  }

  public getEventos() {
    this.spinner.show();
    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (response: PaginatedResult<Evento[]>) => {
          this.eventos = response.result;
          this.pagination = response.pagination;
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao carregar os eventos!', 'Error');
        },
        complete: () => this.spinner.hide(),
      });
  }

  //  public getEventos(){
  //    this.eventoService.getEventos().subscribe(
  //      (response: Evento[]) =>
  //      {
  //        this.eventos = response;
  //        this.eventFilters = this.eventos;
  //      },
  //      error => console.log(error)
  //    );
  //  }

  displayImages() {
    this.showImages = !this.showImages;
  }

  public filterEvents(event: any): void {
    if (this.termFilterChanged.observers.length === 0) {
      this.termFilterChanged.pipe(debounceTime(1000)).subscribe(
        filterBy =>{
          this.eventoService
          .getEventos(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filterBy
          )
          .subscribe({
            next: (response: PaginatedResult<Evento[]>) => {
              this.eventos = response.result;
              this.pagination = response.pagination;
            },
            error: (error: any) => {
              this.spinner.hide();
              this.toastr.error('Erro ao carregar os eventos!', 'Error');
            },
            complete: () => this.spinner.hide(),
          });
      });
    }
    this.termFilterChanged.next(event.value);
  }

  openModal(event: any, eventoId: number, template: TemplateRef<any>): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (result: any) => {
        this.toastr.success('Evento deletado com sucesso!', 'Sucesso');
        this.spinner.hide();
        this.getEventos();
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao deletar o evento!', 'Error');
      },
      complete: () => this.spinner.hide(),
    });
    this.modalRef?.hide();
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`/eventos/detalhe/${id}`]);
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.getEventos();
  }
}
