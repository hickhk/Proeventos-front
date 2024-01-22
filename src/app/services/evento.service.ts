/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHandler, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from '@app/shared/baseUrl.enum';
import { Observable, map, take } from 'rxjs';
import { Evento } from '../models/Evento';
import { User } from '@app/models/account/User';
import { AccountService } from './account.service';
import { PaginatedResult } from '@app/models/Pagination';

@Injectable({
  providedIn: 'root',
})
export class EventoService {

  //tokenUser = JSON.parse(localStorage.getItem('user') || '{}');

  //token = new HttpHeaders({ Authorization: `Bearer ${this.tokenUser.token}`, });

  eventoStatus(evento: Evento) {
    throw new Error('Method not implemented.');
  }

  baseUrl = `${BaseUrl.base}/Eventos`;
  value = window.localStorage.getItem('user') as string; //"gridGrid" is component name + component id.
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: User = JSON.parse(this.value);

  constructor(private http: HttpClient, private account: AccountService) {}

  public getEventos(page?: number, itemsPerpage?: number, term?: string): Observable<PaginatedResult<Evento[]>> {
    const paginatedResult: PaginatedResult<Evento[]> = new PaginatedResult<Evento[]>();
    let params = new HttpParams;

    page = (page == null)? 0: page;
    itemsPerpage = (itemsPerpage == null)? 0: itemsPerpage;

    if(term)
     params = params.append('term', term);

    if(page !== 0 && itemsPerpage !== 0){
      params = params.append('pageNumber',page.toString());
      params = params.append('pageSize', itemsPerpage.toString());
    }


    return this.http
      .get<Evento[]>(this.baseUrl, {observe: 'response', params})
      .pipe(
        take(1),
        map((response) =>{
          paginatedResult.result =  response.body !== null ? response.body : [];
          if(response.headers.has('Pagination')){
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination') + '');
          }
          return paginatedResult;
        })

       )

  }

  public getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`).pipe(take(1));
  }

  public getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http
      .get<Evento[]>(`${this.baseUrl}/${tema}/tema`)
      .pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseUrl, evento).pipe(take(1));
  }

  public put(evento: Evento): Observable<any> {
    return this.http.put(`${this.baseUrl}/${evento.id}`, evento).pipe(take(1));
  }

  public deleteEvento(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(take(1));
  }

  public uploadImage(id: number, file: File): Observable<Evento> {
    const fileImageUpload = file as File;
    const formData = new FormData();
    formData.append('file', fileImageUpload);
    return this.http
      .post<Evento>(`${this.baseUrl}/upload-image/${id}`, formData)
      .pipe(take(1));
  }
}
