
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { of } from 'rxjs';
import { Cursos } from './cursos';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = 'https://us-central1-pav2api.cloudfunctions.net/app/api/cursos/';
  }

  get() {
    return this.httpClient.get(this.resourceUrl);
    
  }

  getById(Id: number) {
    return this.httpClient.get(this.resourceUrl + Id);
  }

  post(obj: Cursos) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

  put(Id: number, obj: Cursos) {
    return this.httpClient.put(this.resourceUrl + Id, obj);
  }

  delete(Id) {
    return this.httpClient.delete(this.resourceUrl + Id);
  }
}


