import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdSliderModule,
  MdToolbarModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {nvD3} from 'ng2-nvd3';

import { AppComponent } from './app.component';
import { HomeComponent} from "./home/home.component";
import { AboutComponent} from "./about/about.component";
import { MaterialComponent } from './material/material.component';
import { PeopleComponent } from './people/people.component';
import { PublicationsComponent } from './publications/publications.component';
import { SpecimenListComponent } from './specimen-list/specimen-list.component';
import { ModelDetailPlainComponent } from './model-detail-plain/model-detail-plain.component';

import { PeopleService } from "./services/people.service";
import { PublicationsService } from "./services/publications.service";
import { SpecimenService } from "./services/specimen.service";
import {ChartService} from "./services/chart.service";

import { KeysPipe } from './keys.pipe';
import {Routing} from "./app.routes";
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    MaterialComponent,
    PeopleComponent,
    PublicationsComponent,
    SpecimenListComponent,
    ModelDetailPlainComponent,
    KeysPipe,
    nvD3,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MdToolbarModule,
    MdSliderModule,
    MdButtonModule,
    MdCheckboxModule,
    MdCardModule,
    Routing
  ],
  providers: [
    PeopleService,
    PublicationsService,
    SpecimenService,
    ChartService
  ],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

