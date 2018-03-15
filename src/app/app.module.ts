import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';


import { CalendarModule } from "angular-calendar";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from './app.component';
import { PlanningInterventionComponent } from './components/planning-intervention/planning-intervention.component';

import { InterventionsService } from './services/interventions.service';
import { IntervenantService } from './services/intervenant.service';


@NgModule({
  declarations: [
    AppComponent,
    PlanningInterventionComponent
  ],
  imports: [
    BrowserModule, FormsModule, CalendarModule.forRoot(), HttpClientModule, 
    NgbModalModule.forRoot(), BrowserAnimationsModule,
    RouterModule.forRoot([
      {path:"home", component: AppComponent},
      {path:"interventions/planning", component: PlanningInterventionComponent},
      {path:"", redirectTo:"/interventions/planning", pathMatch:"full" }
    ])
  ],
  providers: [InterventionsService, IntervenantService],
  bootstrap: [AppComponent]
})
export class AppModule { }
