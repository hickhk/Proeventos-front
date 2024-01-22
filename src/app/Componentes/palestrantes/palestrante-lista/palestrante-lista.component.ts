/* eslint-disable prettier/prettier */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { environment } from '@environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.css']
})
export class PalestranteListaComponent implements OnInit {

  constructor(
    private palestranteService: PalestranteService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 2,
      totalItems: 1,
    } as Pagination;
    this.carregarPalestrantes();
  }

  public palestrantes: Palestrante[] = [];
  public itemsPerPage = 1;
  public pagination = {} as Pagination;
  termFilterChanged: Subject<string> = new Subject<string>();


  public carregarPalestrantes() {
    this.spinner.show();
    this.palestranteService
      .getPalestrantes(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (response: PaginatedResult<Palestrante[]>) => {
          this.palestrantes = response.result;
          this.pagination = response.pagination;
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao carregar os eventos!', 'Error');
        },
        complete: () => this.spinner.hide(),
      });
  }

  public filterPalestrantes(event: any): void {
    if (this.termFilterChanged.observers.length === 0) {
      this.termFilterChanged.pipe(debounceTime(1000)).subscribe(
        filterBy =>{
          this.palestranteService
          .getPalestrantes(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filterBy
          )
          .subscribe({
            next: (response: PaginatedResult<Palestrante[]>) => {
              this.palestrantes = response.result;
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

  public carregaImageUrl(imageName?: string): string{

    if(imageName)
    return environment.apiUrl + `Resources/Images/users/${imageName}`
    else
    return './assets/images/user.jpg';

  }

}
