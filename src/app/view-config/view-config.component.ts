import { Component, OnInit } from '@angular/core';
import {ChartService} from "../services/chart.service";
import {DialogViewsettingComponent} from "../dialog-viewsetting/dialog-viewsetting.component";
import {SectionContourService} from "../services/section-contour.service";
import {MdDialog} from "@angular/material";
import {chartDefinitions} from "../shared/chart-definitions";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-view-config',
  templateUrl: './view-config.component.html',
  styleUrls: ['./view-config.component.css']
})
export class ViewConfigComponent implements OnInit {
  private selectedSection;
  private sectionContours;

  viewConfigDialog() {
    const dialogRef = this.dialog.open(DialogViewsettingComponent, {
      height: '600px',
      width: '600px',
      // Get sectionContours if undefined
      data: this.sectionContours ? this.sectionContours : this.sectionContourService.getSectionContours()
    });
    dialogRef
      .afterClosed()
      .finally(() => {
        this.dataService.setActiveSection(this.selectedSection);
      })
      .subscribe(result => {
        if (result) {
          this.sectionContourService.setSectionContours(result);
        }
      });
  }

  constructor( public dialog: MdDialog,
               private dataService: DataService,
               private chartService: ChartService,
               private sectionContourService: SectionContourService, ) {
    dataService.activeSection$.subscribe(section => this.selectedSection);
    sectionContourService.sectionContours$.subscribe(sectionContours => {
      // Update chart according to section contour setting
      sectionContours
        .filter(e => e.visible && e.multiSections)
        .forEach(e => {
          chartDefinitions.forEach(definition => {
            if (e.key.includes(definition.data['ref']) || e.key.includes(definition.data['cmps'])) {
              this.chartService.setActiveChart(definition.id);
            }
          });
        });
      this.sectionContours = sectionContours;
    });
  }

  ngOnInit() {
  }

}
