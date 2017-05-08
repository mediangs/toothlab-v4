import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class ChartService {

  // Observable source
  private activeSectionSource = new Subject<number>();
  private activeChartSource = new Subject<any>();

  // Observable stream
  activeSection$ = this.activeSectionSource.asObservable();
  activeChart$ = this.activeChartSource.asObservable();

  setActiveSection(section: number) {
    this.activeSectionSource.next(section);
  }

  setActiveChart(chartID: any) {
    this.activeChartSource.next(chartID);
  }
}
