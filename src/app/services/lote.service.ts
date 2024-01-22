import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lote } from '@app/models/Lote';
import { BaseUrl } from '@app/shared/baseUrl.enum';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoteService {
  lotestatus(lote: Lote) {
    throw new Error('Method not implemented.');
  }

  baseUrl = `${BaseUrl.base}/Lotes`;

  constructor(private http: HttpClient) {}

  public GetLotesByEventoId(eventoId: number): Observable<Lote[]> {
    return this.http
      .get<Lote[]>(`${this.baseUrl}/GetLotesByEventoId/${eventoId}`)
      .pipe(take(1));
  }

  public GetLoteByEventoIdLoteId(
    eventoId: number,
    id: number
  ): Observable<Lote> {
    return this.http
      .get<Lote>(`${this.baseUrl}/GetLoteByEventoIdLoteId/${eventoId}/${id}`)
      .pipe(take(1));
  }

  public saveLotes(eventoId: number, lotes: Lote[]): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/SaveLotes/${eventoId}`, lotes)
      .pipe(take(1));
  }

  public deleteLote(eventoId: number, id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${eventoId}/${id}`).pipe(take(1));
  }
}
