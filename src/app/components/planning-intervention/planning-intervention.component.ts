import { Component, OnInit,  TemplateRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent} from 'angular-calendar';
import { InterventionsService } from '../../services/interventions.service';
import { Intervention } from '../../metiers/intervention';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbActiveModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Intervenant } from '../../metiers/intervenant';
import { Materiel } from '../../metiers/Materiel';
import { IntervenantService } from '../../services/intervenant.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-planning-intervention',
  templateUrl: './planning-intervention.component.html',
  styleUrls: ['./planning-intervention.component.css']
})
export class PlanningInterventionComponent implements OnInit, OnDestroy {

  @ViewChild('modalContentEdit')
  public modalContent: TemplateRef<any>;

  @ViewChild('modalContentDelete')
  public modalContentDelete: TemplateRef<any>;

  //public modal: NgbModal ;
  public modalRef : any;
  typeAction : string;
  view: string = 'month';
  viewDate: Date = new Date();

  public intervention2 = [];
  public interventions: Subject<Intervention[]>;
  public interventionsSubscription: Subscription;
  public itsSubs: Subscription;

  public editIntervention: Intervention;
  public closeResult: string;
  public events : CalendarEvent[] = [];

  public intervenants: Intervenant[] = [];
  public selectedIntervenant: Intervenant;
  public intervenantNull:any;

  modalData: { action: string, event: CalendarEvent};

  refresh: Subject<any> = new Subject();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  activeDayIsOpen: boolean = true;

  constructor(private interventionService: InterventionsService, 
    private modal: NgbModal, private intervenantService: IntervenantService) {
    this.typeAction = "";
    this.selectedIntervenant = new Intervenant(0,"", "");
  }

  ngOnInit() {
    // [] version
    this.interventionService.month = this.viewDate;
    this.editIntervention = new Intervention(0, "", null, null, "", "", null, null);
    //this.selectedIntervenant = null;
    this.interventions = new Subject();
    /*this.interventionService.refreshList2().then(its=> {
      this.intervention2 = its
      console.log("its2")
      console.log(this.intervention2)
      this.firstSynchronizeInterventionsAndEvents();
    })*/
    // subject version
    this.interventionsSubscription = this.interventionService.listeInterventions().subscribe(its =>{
      this.interventions.next(its)
    })
    this.interventionService.refreshList();
    this.firstSynchronizeInterventionsAndEvents2();
  }

  ngOnDestroy(): void {
    this.interventionsSubscription.unsubscribe();
  }

  updateList():void{
    this.interventionService.month = this.viewDate;
    this.interventionService.refreshList();
  }
  firstSynchronizeInterventionsAndEvents2():void{
    console.log('in sync 2')
    this.interventions.forEach(it=>{
      console.log(it)
      this.events = [];
      it.forEach(i=>{
        this.events.push({
          start : new Date(i.interventionDate),
          title : i.singleInterventionNumber,
          color : colors.blue,
          actions : this.actions,
          meta:{
            id:i.id
          }
        })
      })
      
      console.log(this.events)
    })
    //this.refresh.next();

  }

  firstSynchronizeInterventionsAndEvents():void{
    console.log('in sync')
    this.events = [];
    this.intervention2.forEach(i=>{
      this.events.push({
        start : new Date(i.interventionDate),
        title : i.singleInterventionNumber,
        color : colors.yellow,
        actions : this.actions,
        meta:{
          id:i.id
        }
      })
      console.log(this.events)
    })
    this.refresh.next();
    /*this.interventionsSubscription = this.interventions.subscribe(its=>{
      console.log("itss ==>")
      console.log(its)
      its.forEach(i=>{
        this.events.push({
          start : i.interventionDate,
          title : i.singleInterventionNumber,
          color : colors.yellow,
          actions : this.actions,
          meta:{
            id:i.id
          }
        })
      })
      console.log(this.events)
    });
    //this.refresh.next();*/
  }

  synchronizeEventAndInterventionAfterDelete():void{
    this.events.forEach(e=>{
      let pos = this.events.findIndex(e=> e.meta.id == this.editIntervention.id);
      if (pos != -1) this.events.splice(pos, 1);
    });
    console.log(this.events);
    // necessaire de faire deux refresh pour maj vue DEGUE mais on modifiera tt plus tard
    // en effet au lieu de mettre de behavior subject ds service => plutot simple []
    // pour sadapter a angular calandar
    this.refresh.next();
    this.interventionService.refreshList();
    console.log( "refresh");
    console.log(this.interventions.forEach(its=> console.log(its)));
  }

  onChangeIntervenant(event):void{
    this.selectedIntervenant = event;
    this.editIntervention.intervenant = this.selectedIntervenant;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    if (action == "Edited") {
      this.typeAction = "Edition";
      console.log(event.meta.id);
      //this.editIntervention = this.interventions.find(i => i.id == event.meta.id);
      this.editIntervention = this.interventionService.findOne(event.meta.id);
      if (this.editIntervention.intervenant != null)
        this.selectedIntervenant = this.editIntervention.intervenant;
      //console.log(this.selectedIntervenant)
      this.intervenantService.getIntervenants().then(res=>{
        this.intervenants = res;
        console.log(this.intervenants);
      });
      this.modalData = { event, action };
      this.modalRef = this.modal.open(this.modalContent, { size: 'lg' });
      this.modalRef.result.then(result => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.selectedIntervenant = new Intervenant(0,"", "");
        })
      ;
    }
    if (action == "Deleted") {
      console.log("event id to delete " + event.meta.id);
      this.typeAction = "Suppression";
      //this.editIntervention = this.interventions.find(i => i.id == event.meta.id);
      this.editIntervention = this.interventionService.findOne(event.meta.id);
      this.modalData = { event, action };
      this.modalRef=this.modal.open(this.modalContentDelete, { size: 'lg' });
      this.modalRef.result.then(result => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.refresh.next()
      })
    }
    
    
  }
  
  deleteIntervention(): void{
    console.log("in delete meth");
    this.interventionService.deleteIntervention(this.editIntervention.id)
    //this.interventions  = this.interventionService.listeInterventions();
    this.interventionService.refreshList();
    console.log(this.interventions);
    this.synchronizeEventAndInterventionAfterDelete();
    this.modalRef.close();

  }

  saveIntervention():void{
    console.log('in save meth');
    this.editIntervention.intervenant = this.selectedIntervenant;
    this.interventionService.save(this.editIntervention);
    //this.refresh.next();
    this.modalRef.close();
    //this.selectedIntervenant = null;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }
 
}
