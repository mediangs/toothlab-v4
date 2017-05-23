import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class ChartService {

  // Observable source
  private activeChartSource = new Subject<number>();

  // Observable stream
  activeChart$ = this.activeChartSource.asObservable();

  setActiveChart(chartID: any) {
    this.activeChartSource.next(chartID);
  }
}
