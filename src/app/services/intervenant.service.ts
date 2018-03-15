import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Intervenant } from '../metiers/intervenant';

@Injectable()
export class IntervenantService {

  private baseExtendedUrl: string = "http://localhost:8080/extended_api"
  public intervenants: Intervenant[];

  constructor(private http: HttpClient){
    this.intervenants = new Array();
  }

  public getIntervenants():Promise<Intervenant[]>{
    return this.http.get<Intervenant[]>(`${this.baseExtendedUrl}/intervenants/findAll`).toPromise();
  }

}
