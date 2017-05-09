import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdProgressBarModule, MdSelectModule, MdSliderModule,
  MdToolbarModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {nvD3} from 'ng2-nvd3';
import 'hammerjs';

import { AppComponent } from './app.component';
import { HomeComponent} from "./home/home.component";
import { AboutComponent} from "./about/about.component";
import { MaterialComponent } from './material/material.component';
import { PeopleComponent } from './people/people.component';
import { PublicationsComponent } from './publications/publications.component';
import { SpecimenListComponent } from './specimen-list/specimen-list.component';
import { SpecimenDetailComponent } from './specimen-detail/specimen-detail.component';

import { PeopleService } from "./services/people.service";
import { PublicationsService } from "./services/publications.service";
import { SpecimenService } from "./services/specimen.service";
import { DataService } from "./services/data.service";

import { KeysPipe } from './keys.pipe';
import { Routing } from "./app.routes";
import { SpecimenChartComponent } from './specimen-chart/specimen-chart.component';
import { SectionInfoboxComponent } from './section-infobox/section-infobox.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    MaterialComponent,
    PeopleComponent,
    PublicationsComponent,
    SpecimenListComponent,
    SpecimenDetailComponent,
    KeysPipe,
    nvD3,
    SpecimenChartComponent,
    SectionInfoboxComponent,
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
    MdSelectModule,
    MdProgressBarModule,
    Routing
  ],
  providers: [
    PeopleService,
    PublicationsService,
    SpecimenService,
    DataService
  ],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

