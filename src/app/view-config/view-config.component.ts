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
  private cmps_element = ['blx', 'ptu', 'rcp'];


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
        // draw outlines
        this.dataService
          .setActiveSection(this.selectedSection ? this.selectedSection : this.dataService.getActiveSection());
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

  initMenu() {
    const menu = [
      {name: 'Thinnest dentin', ref: 'mindist_ref_line', cmps: 'mindist_cmps_line'},
      {name: 'Mesial dentin', ref: 'mesial_ref_line', cmps: 'mesial_cmps_line'},
      {name: 'Distal dentin', ref: 'distal_ref_line', cmps: 'distal_cmps_line'},
    ];

    const menu_expanded_sample = [
      {name: 'Thinnest dentin', menuItems: [
        {key: 'mindist_ref_line', name: 'pre'},
        {key: 'mindist_cmps_line.blx', name: 'blx'},
        {key: 'mindist_cmps_line.ptu', name: 'ptu'},
        {key: 'mindist_cmps_line.rcp', name: 'rcp'}
      ]},
    ];

    const menu_expanded = [];

    menu.forEach(e => {
      const menuItems = [];
      menuItems.push({key: e.ref, name: 'pre'});
      this.cmps_element.forEach(cmp => {
        menuItems.push({key: e.cmps + '.cmp', name: cmp});
      });
      menu_expanded.push({name: e.name, menuItems: menuItems});
    });

    console.log(menu_expanded);


  }

}
