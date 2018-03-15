import { Injectable } from '@angular/core';
import { Intervention } from '../metiers/intervention';
import { Intervenant } from '../metiers/intervenant';
import { Materiel } from '../metiers/Materiel';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Pageable } from '../metiers/pageable';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class InterventionsService {

  private baseExtendedUrl: string = "http://localhost:8080/extended_api/interventions"

  public interventions: BehaviorSubject<Intervention[]>;
  public interventions2: Intervention[];

  //public intervenants: Intervenant[];

  public month: Date;
  
  constructor(private http: HttpClient) {
    this.interventions = new BehaviorSubject([]);
    this.interventions2 = new Array();
  }

  public refreshListOld():void{
    console.log('in refresh list')
    let params: HttpParams = new HttpParams();
    params = params.set("month", new Date().toISOString()  );
    this.http.get<Intervention[]>(this.baseExtendedUrl+'/planning', {params:params})
      .toPromise()
      .then(its => this.interventions.next(its))
      .catch(err=> console.error(err))
    ;
    /*this.interventions.next([
      new Intervention(1,"slhc979", new Date, new Date, "in progress", "", new Materiel(1, "khh"), new Intervenant(1,"r","ee")),
      new Intervention(2,"slhc979", new Date, new Date, "finished", "", new Materiel(2, "khh"), new Intervenant(2,"r","ee"))
    ]);*/
  }
  public refreshList():void{
    console.log('in refresh list')
    let params: HttpParams = new HttpParams();
    params = params.set("month", this.month.toISOString()  );
    this.http.get<Intervention[]>(this.baseExtendedUrl+'/planning', {params:params})
      .toPromise()
      .then(its =>{
        /*this.interventions2 = its*/ this.interventions.next(its)
        //console.log(this.interventions2)
      })
    /*this.interventions.next([
      new Intervention(1,"slhc979", new Date, new Date, "in progress", "", new Materiel(1, "khh"), new Intervenant(1,"r","ee")),
      new Intervention(2,"slhc979", new Date, new Date, "finished", "", new Materiel(2, "khh"), new Intervenant(2,"r","ee"))
    ]);*/
    
  }
  public refreshList2():Promise<Intervention[]>{
    console.log('in refresh list2')
    let params: HttpParams = new HttpParams();
    params = params.set("month", new Date().toISOString()  );
    return this.http.get<Intervention[]>(this.baseExtendedUrl+'/planning', {params:params}).toPromise()
 
    /*this.interventions.next([
      new Intervention(1,"slhc979", new Date, new Date, "in progress", "", new Materiel(1, "khh"), new Intervenant(1,"r","ee")),
      new Intervention(2,"slhc979", new Date, new Date, "finished", "", new Materiel(2, "khh"), new Intervenant(2,"r","ee"))
    ]);*/
    
  }
  
  // liste pour le planning non paginé
  public listeInterventions():Observable<Intervention[]>{
    return this.interventions.asObservable();
  }

  public edit: Intervention;
  public findOne(id: number):Intervention{
     let pos = -1;
     this.interventions.subscribe(i=>{
      pos = i.findIndex(ii=>ii.id == id)
      console.log("posotion in service findone=" +pos);
      this.edit = i.find(ii=> ii.id == id)
     })

     return this.edit;
  }

  public saveOld(int: Intervention):void{
    console.log(int)
    this.interventions.subscribe(is=>{
      is.forEach(i=>{
        if (i.id == int.id) {
          console.log("found")
          i = int;
        }
      })
    })
  }

  public save(i:Intervention):Promise<Intervention>{
    let url = `${this.baseExtendedUrl}/create`;
    if (i.id == 0) return this.http.post<Intervention>(`${this.baseExtendedUrl}/create`, i).toPromise();
    else return this.http.put<Intervention>(`${this.baseExtendedUrl}/update`, i).toPromise();
  }

  public deleteIntervention(id: number): Promise<Intervention>{
    let url = `${this.baseExtendedUrl}/delete/${id}`;
    return this.http.delete<Intervention>(url).toPromise();
  }

  public deleteInterventionOld(id: number): void{
    let pos = -1; 
    this.interventions.subscribe(i=> {
      pos = i.findIndex(ii=>ii.id == id)
    });
    console.log("posotion in service delete=" +pos);
    //if (pos != -1) this.interventions. splice(pos, 1);
    //this.refreshList();
  }



}
