import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Evento } from '../../models/Evento';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  modalRef?: BsModalRef;
  typeSelected: string;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.typeSelected = 'ball-fussion';
  }

  public eventos: Evento[] = [];
  public eventFilters: Evento[] = [];
  showImages = true;
  private _filterList = '';

  public get filterList(): string {
    return this._filterList;
  }

  public set filterList(value: string) {
    this._filterList = value;
    this.eventFilters = this._filterList
      ? this.filterEvents(this._filterList)
      : this.eventos;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
  }

  public getEventos() {
    // this.eventoService.getEventos().subscribe({
    //   next: (eventos: Evento[]) => {
    //     this.eventos = eventos;
    //     this.eventFilters = this.eventos;
    //   },
    //   error: (error: any) => {
    //     this.spinner.hide();
    //     this.toastr.error('Erro ao carregar os eventos!', 'Error');
    //   },
    //   complete: () => this.spinner.hide(),
    // });
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

  private filterEvents(filterBy: string): Evento[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: { tema: string; local: string }) =>
        evento.tema.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.toastr.success('Evento atualizado com sucesso!', 'Sucesso');
    this.modalRef?.hide();
  }

  decline(): void {
    this.modalRef?.hide();
  }
}
