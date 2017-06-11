import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class ActiveSectionService {

  private selectedSection;
  // Observable source
  private activeSectionSource = new Subject<number>();
  // Observable stream
  activeSection$ = this.activeSectionSource.asObservable();
  setActiveSection(section: number) {
    this.selectedSection = section;
    this.activeSectionSource.next(section);
  }
  getActiveSection() {
    return this.selectedSection;
  }
}


