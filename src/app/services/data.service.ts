import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class DataService {

  // Observable source
  private activeSectionSource = new Subject<number>();

  private sectionContourSource = new Subject();

  // Observable stream
  activeSection$ = this.activeSectionSource.asObservable();

  setActiveSection(section: number) {
    this.activeSectionSource.next(section);
  }
}


