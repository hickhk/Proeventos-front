/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RedeSocial } from '@app/models/RedeSocial';
import { BaseUrl } from '@app/shared/baseUrl.enum';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedeSocialService {

  baseUrl = `${BaseUrl.base}/redesSociais`;

constructor(private http: HttpClient) { }

public GetRedesSociais(origem:string, id: number): Observable<RedeSocial[]> {

  const url = id === 0 ? `${this.baseUrl}/${origem}`:`${this.baseUrl}/${origem}/${id}`;

  return this.http
    .get<RedeSocial[]>(url).pipe(take(1));
}

public GetRedesSociaisByPalestrante(eventoId: number): Observable<RedeSocial[]> {
  return this.http
    .get<RedeSocial[]>(`${this.baseUrl}/GetRedesSociaisByPalestrante`)
    .pipe(take(1));
}

public SaveRedeSocial(origem: string, id: number, redesSociais: []): Observable<any> {

  const url = id === 0 ? `${this.baseUrl}/${origem}`:`${this.baseUrl}/${origem}/${id}`;

  return this.http
    .put<RedeSocial[]>(url, redesSociais)
    .pipe(take(1));
}

  public deleteRedeSocial(origem: string, id: number, redeSocialId: number): Observable<any> {

    const url = id === 0 ? `${this.baseUrl}/${origem}/${redeSocialId}`:`${this.baseUrl}/${origem}/${id}/${redeSocialId}`;

    return this.http.delete(url).pipe(take(1));
  }

}
