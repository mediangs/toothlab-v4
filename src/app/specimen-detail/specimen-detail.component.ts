
import {Component, OnInit, ElementRef, Renderer, AfterViewInit, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MdDialog} from "@angular/material";

import {SpecimenService} from '../services/specimen.service';
import {SectionContourService} from "../services/section-contour.service";
import {ActiveSectionService} from "../services/active-section.service";

import {Specimen, X3dModel} from '../schemas/specimen-schema';
import {SectionModelSchema, ViewSectionSchema} from '../schemas/section-schema';
import {duplicateArray, gradientColorWithRange, lineLength, nearest, repeatedColor} from '../shared/utils';

import {DialogSectionInfoComponent} from "../dialog-section-info/dialog-section-info.component";
import {DialogHelpComponent} from "../dialog-help/dialog-help.component";

declare const x3dom: any;

@Component({
  selector: 'app-specimen-detail',
  templateUrl: './specimen-detail.component.html',
  styleUrls: ['./specimen-detail.component.css']
})

export class SpecimenDetailComponent implements OnInit, AfterViewInit {

  private zoomed = false;
  private zoomText = "Zoom";

  private specimen: Specimen;
  private specimenId: string;

  private isSectionDataLoaded = false;
  private cmpKeys: Array<string>;

  sectionData: SectionModelSchema; // JSON
  coordInfo = {}; // coordPoints, coordIndex, coordColor

  selectedSection = 0;
  sliderAttr = {};  // md-slider min, max, step

  private sectionContours;

  sectionInfoDialog() {
    this.dialog.open(DialogSectionInfoComponent, {
      height: '500px',
      width: '350px',
      position: {right: '10px', top: '10px'},
      data: this.sectionData.sections
        .find(s => s.section === nearest(this.sectionData.sections.map(s => s.section), this.selectedSection))
    });
  }

  setActiveSection(sectionLevel){
    this.dataService.setActiveSection(sectionLevel)
  }

  helpDialog() {
    this.dialog.open(DialogHelpComponent, {
      height: '400px',
      width: '500px',
    });
  }

  constructor(private specimenService: SpecimenService,
              private dataService: ActiveSectionService,
              private sectionContourService: SectionContourService,
              public dialog: MdDialog,
              private route: ActivatedRoute,
              private router: Router,
              private el: ElementRef,
              private renderer: Renderer2) {

    dataService.activeSection$.subscribe( section => {
      this.selectedSection = section;
      this.setSectionContourLine(section);
    });

    sectionContourService.sectionContours$.subscribe(sectionContours => {
      this.sectionContours = sectionContours;
      this.setSectionContourLine(this.selectedSection);
    });
  }

  ngAfterViewInit(){
    // color-picker사용을 위해 소문자로 바꾸어야함 ?
    this.specimen.x3dModels.forEach(x3d => {
      // x3d.color = x3d.color.toLowerCase();
      this.updateModelColor(x3d);
    });

  }

  ngOnInit() {
    this.route.params.subscribe(params => this.specimenId = params['id']);
    this.specimen = this.specimenService.getSpecimenById(this.specimenId);
    this.specimenService.getSectionData(this.specimen)
      .finally(() => {
        this.isSectionDataLoaded = true;

        // cmpKeys for viewConfigComponent
        this.cmpKeys = Object.keys(this.sectionData.sections[0].mindists_cmp).map(k => k);

        // Should be called once
        this.sectionContours = this.sectionContourService.initSectionContours(this.sectionData.sections[0]);
        this.dataService.setActiveSection(nearest(this.sectionData.sections.map(s => s.section), this.sliderAttr['max'] / 2));
        console.log('SpecimenDetail data loaded.');

        // Apply default reset
        this.applyPreset(0);
      })
      .subscribe(data => {
        this.sectionData = data;
        this.sliderAttr['max'] = Math.max.apply(Math, data.sections.map(o => o.section));
        this.sliderAttr['min'] = Math.min.apply(Math, data.sections.map(o => o.section));
        this.sliderAttr['step'] = +((this.sliderAttr['max'] - this.sliderAttr['min'])
                                    / (data.sections.length - 1)).toFixed(2);
        this.sliderAttr['max'] -= this.sliderAttr['step'];
      });


    x3dom.reload();

  }

  updateModelColor(x3d) {
    const el = document.getElementById(x3d.name + '__MA');
    // console.log(document.getElementById('canal_pre__MA'));

    if (document.getElementById(x3d.name))

      console.log(document.getElementById(x3d.name).childElementCount);
    if (el) {
      this.renderer.setAttribute(el, 'diffuseColor', x3d.color);
    }
  }

  applyPreset(id){

    const preset = this.specimen.presets.find(preset => preset.id === id);

    if(preset) {
      if(preset.activeSection) this.setActiveSection(preset.activeSection);
      if(preset.specimen.position) this.specimen.position = preset.specimen.position;
      if(preset.specimen.orientation) this.specimen.orientation = preset.specimen.orientation;

      this.specimen.x3dModels.forEach(model => {
        model.visible = preset.specimen.visibleX3dModels.find(m => m === model.name);
      });

      this.sectionContourService.setSectionContoursWithPreset(preset.visibleSectionContours);
    }
  }

  restoreModelStatus() {
    this.specimen.x3dModels.forEach(el => {
      this.renderer.setAttribute(
        document.getElementById(el.name + '__MA'),
        'transparency', el.transparency.toString());

      this.renderer.setAttribute(
        document.getElementById(el.name + '__MA'),
        'diffuseColor', el.color);
    });
  }

  setTransparency(element: X3dModel, transparency: number) {
    element.prevTransparency = element.transparency;
    element.transparency = transparency;
    this.renderer.setAttribute(
      document.getElementById(element.name + '__MA'),
      'transparency', element.transparency.toString());
  }

  toggleZoom() {
    const button = document.getElementById('zoom-button');
    this.zoomed = !this.zoomed;
    this.zoomText = this.zoomed ? "Unzoom" : "Zoom";
  }

  setSectionContourLine(sectionLevel) {
    // find nearest section level
    const section = this.sectionData.sections
      .reduce((prev, curr) =>
        Math.abs(curr.section - sectionLevel) < Math.abs(prev.section - sectionLevel) ? curr : prev);
    this.coordInfo = {};

    this.sectionContours
      .filter(obj => obj.visible)
      .forEach(obj => {

        if (!obj.nested && !obj.multiSections) {
          this.coordInfo[obj.key] = this.getCoordInfo(obj.color, section[obj.key]);
          return;
        }

        if (obj.nested && !obj.multiSections) {
          const n = obj.key.indexOf('.');
          this.coordInfo[obj.key] = this.getCoordInfo(obj.color, section[obj.key.slice(0,n)][obj.key.slice(n+1)]);
          return;
        }

        if (!obj.nested && obj.multiSections ) {
          this.sectionData.sections.map(d => {
            if ( d.section < this.sectionData.model.evaluating_canal_furcation) {
              const key = obj.key + '.' + d.section.toString();
              const coord = d[obj.key];
              if (coord.length === 2) {
                this.coordInfo[key] = this.getCoordInfo(
                  gradientColorWithRange('#f00', '#00f', 0.5, 1, lineLength(duplicateArray(coord))), coord);
              } else {
                this.coordInfo[key] = this.getCoordInfo(obj.color, d[obj.key]);
              }
            }
          });
          return;
        }

        if (obj.nested && obj.multiSections ) {
          const n = obj.key.indexOf('.');
          this.sectionData.sections.map(d => {
            if ( d.section < this.sectionData.model.evaluating_canal_furcation) {
              const key = obj.key + '.' + d.section.toString();
              const coord = d[obj.key.slice(0, n)][obj.key.slice(n + 1)];
              if (coord.length === 2) {
                this.coordInfo[key] = this.getCoordInfo(
                  gradientColorWithRange('#f00', '#00f', 0.5, 1, lineLength(duplicateArray(coord))), coord);
              } else {
                this.coordInfo[key] = this.getCoordInfo(obj.color, coord);
              }
            }
          });
          return;
        }
      });
  }

  getCoordInfo(elementColor: string, outline) {
    const coordPoints = [].concat.apply([], outline);
    const coordIndex  = Object.keys(outline).map(x => Number(x)).concat(0);
    const coordColor = repeatedColor(elementColor, coordPoints.length / 3);
    return {coordPoints : coordPoints, coordIndex : coordIndex, coordColor : coordColor};
  }

  gotoAnatomy() {
    this.router.navigate(['/specimen-list']);
  }

  reload() {
    this.restoreModelStatus();
  }
}
