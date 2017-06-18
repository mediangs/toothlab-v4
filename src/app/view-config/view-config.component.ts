import {Component, Input, OnInit} from '@angular/core';
import {ChartService} from "../services/chart.service";
import {DialogViewsettingComponent} from "../dialog-viewsetting/dialog-viewsetting.component";
import {SectionContourService} from "../services/section-contour.service";
import {MdDialog} from "@angular/material";
import {chartDefinitions} from "../shared/chart-definitions";
import {ActiveSectionService} from "../services/active-section.service";

@Component({
  selector: 'app-view-config',
  templateUrl: './view-config.component.html',
  styleUrls: ['./view-config.component.css']
})
export class ViewConfigComponent implements OnInit {
  @Input() cmpKeys: Array<string>; // ['blx', 'ptu', 'rcp']
  private selectedSection;
  private sectionContours;
  private menu_all = [];
  private menu_mindist;
  private menu_mesial;
  private menu_distal;
  private selectedDirection;  //mindist, mesial, diatal
  private selectedName; // pre, blx, ptu, rcp, ...


  onSelect(direction, key, name) {
    //key : mindist_ref_line,  mindists_cmp_line.ptu
    if (key) this.sectionContourService.setSectionContoursWithMultisections(key);
    this.selectedDirection = direction;
    this.selectedName = name;
  }

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
               private dataService: ActiveSectionService,
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
    this.initMenu();
  }

  initMenu() {
    const menuTemplate = [
      {name: 'Thinnest dentin', ref: 'mindist_ref_line', cmps: 'mindists_cmp_line'},
      {name: 'Mesial dentin', ref: 'mesial_ref_line', cmps: 'mesials_cmp_line'},
      {name: 'Distal dentin', ref: 'distal_ref_line', cmps: 'distals_cmp_line'},
    ];

    /*
    const menu_all_sample = [
      {name: 'Thinnest dentin', triggerName: 'Thinnest dentin',
        menuItems: [
        {key: 'mindist_ref_line', name: 'pre'},
        {key: 'mindist_cmps_line.blx', name: 'blx'},
        {key: 'mindist_cmps_line.ptu', name: 'ptu'},
        {key: 'mindist_cmps_line.rcp', name: 'rcp'}
        ]},
    ];
    */

    menuTemplate.forEach(e => {
      const menuItems = [];
      menuItems.push({key: e.ref, name: 'pre'});
      this.cmpKeys.forEach(cmp => {
        menuItems.push({key: e.cmps + '.' + cmp, name: cmp});
      });
      this.menu_all.push({name: e.name, triggerName: e.name.replace(' ',''), menuItems: menuItems});
    });

    this.menu_mindist = this.menu_all[0];
    this.menu_mesial =this.menu_all[1];
    this.menu_distal = this.menu_all[2];
  }

}
