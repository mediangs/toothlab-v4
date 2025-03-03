import {RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";
// import {AboutComponent} from "./about/about.component";
// import {MaterialComponent} from "./material/material.component";
import {PeopleComponent} from "./people/people.component";
import {PublicationsComponent} from "./publications/publications.component";
import {SpecimenListComponent} from "./specimen-list/specimen-list.component";
import {SpecimenDetailComponent} from "./specimen-detail/specimen-detail.component";

const routes = [
  {path : '', component : HomeComponent},
  {path : 'specimen-list', component : SpecimenListComponent},
  {path : 'specimen-detail/:id', component : SpecimenDetailComponent},
  // {path : 'about', component : AboutComponent},
  {path : 'people', component : PeopleComponent},
  {path : 'publications', component : PublicationsComponent},
  // {path : 'material', component : MaterialComponent}
];

export const Routing = RouterModule.forRoot(routes);
