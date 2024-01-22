/* eslint-disable prettier/prettier */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from '@app/shared/baseUrl.enum';
import { AccountService } from './account.service';
import { Palestrante } from '@app/models/Palestrante';
import { Observable, map, take } from 'rxjs';
import { PaginatedResult } from '@app/models/Pagination';

@Injectable({
  providedIn: 'root'
})
export class PalestranteService {

  baseUrl = `${BaseUrl.base}/palestrantes`;
  value = window.localStorage.getItem('user') as string; //"gridGrid" is component name + component id.
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: Palestrante = JSON.parse(this.value);

  constructor(private http: HttpClient, private account: AccountService) {}

  public getPalestrantes(page?: number, itemsPerpage?: number, term?: string): Observable<PaginatedResult<Palestrante[]>> {
    const paginatedResult: PaginatedResult<Palestrante[]> = new PaginatedResult<Palestrante[]>();
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
      .get<Palestrante[]>(this.baseUrl + '/getAll', {observe: 'response', params})
      .pipe(
        take(1),
        map((response) =>{
          paginatedResult.result =  response.body !== null ? response.body : [];
          if(response && response.headers.has('Pagination')){
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination') + '');
          }
          return paginatedResult;
        })

       )
  }

  public getPalestrante(): Observable<Palestrante> {
    return this.http.get<Palestrante>(`${this.baseUrl}/getPalestrante`).pipe(take(1));
  }

  public post(palestrante: Palestrante): Observable<Palestrante> {
    return this.http.post<Palestrante>(this.baseUrl, palestrante).pipe(take(1));
  }

  public put(palestrante: Palestrante): Observable<any> {
    return this.http.put(`${this.baseUrl}`, palestrante).pipe(take(1));
  }

  public deletePalestrante(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(take(1));
  }

}
