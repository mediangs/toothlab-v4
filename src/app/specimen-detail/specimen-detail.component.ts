import {Component, OnInit, ElementRef, Renderer} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SpecimenService} from '../services/specimen.service';
import {Specimen, X3dModel} from '../schemas/specimen-schema';
import {SectionModelSchema, ViewSectionSchema} from '../schemas/section-schema';
import {duplicateArray, gradientColorWithRange, lineLength, nearest, repeatedColor} from '../shared/utils';
import {DataService} from "../services/data.service";
import {nestedSectionContours, sectionContours} from "../shared/section-contours";
import {MdDialog} from "@angular/material";
import {DialogViewsettingComponent} from "../dialog-viewsetting/dialog-viewsetting.component";
import {DialogSectionInfoComponent} from "../dialog-section-info/dialog-section-info.component";
import {SectionContourService} from "../services/section-contour.service";
import {chartDefinitions} from "../shared/chart-definitions";
import {ChartService} from "../services/chart.service";

declare const x3dom: any;

@Component({
  selector: 'app-specimen-detail',
  templateUrl: './specimen-detail.component.html',
  styleUrls: ['./specimen-detail.component.css']
})

export class SpecimenDetailComponent implements OnInit {

  private zoomed = false;

  private specimen: Specimen;
  private specimenId: string;

  private isSectionDataLoaded = false;

  color = '#0ff';
  modelWidth = 100;
  modelHeight = 100;

  sectionData: SectionModelSchema; // JSON
  coordInfo = {}; // coordPoints, coordIndex, coordColor

  selectedSection = 0;
  sliderAttr = {};  // md-slider min, max, step

  private sectionContours;

  setSelectedSection(sectionLevel: number) {
    this.selectedSection = sectionLevel;
    this.dataService.setActiveSection(this.selectedSection);
  }

  sectionInfoDialog() {
    const dialogRef = this.dialog.open(DialogSectionInfoComponent, {
      height: '500px',
      width: '350px',
      position: {right: '10px', top: '10px'},
      data: this.sectionData.sections
        .find(s => s.section === nearest(this.sectionData.sections.map(s => s.section), this.selectedSection))
    });
  }

  viewConfigDialog() {
    const dialogRef = this.dialog.open(DialogViewsettingComponent, {
      height: '600px',
      width: '600px',
      data: this.sectionContours
    });
    dialogRef
      .afterClosed()
      .finally(() => {
        this.setSelectedSection(this.selectedSection);
      })
      .subscribe(result => {
        if (result) {
          this.sectionContours = result;
        }
      });
  }

  constructor(private specimenService: SpecimenService,
              private dataService: DataService,
              private chartService: ChartService,
              private sectionContourService: SectionContourService,
              public dialog: MdDialog,
              private route: ActivatedRoute,
              private router: Router,
              private renderer: Renderer) {


    dataService.activeSection$.subscribe( section => {
      this.selectedSection = section;
      if (!this.sectionContours) {
        this.sectionContours = this.sectionContourService.getSectionContours(this.sectionData.sections[0]);
      }
      this.setSectionContourLine(section);
    });

    sectionContourService.sectionContours$.subscribe(sectionContours => {
      this.sectionContours = sectionContours;
      sectionContours
        .filter(e=> e.visible && e.multiSections)
        .forEach(e => {
          chartDefinitions.forEach(cd =>{
            if (e.key.includes(cd.data['ref']) ||e.key.includes(cd.data['cmps'])) {
              this.chartService.setActiveChart(cd.id);
            }
          });
        });
      this.setSectionContourLine(this.selectedSection);

    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.specimenId = params['id']);
    this.specimen = this.specimenService.getSpecimenById(this.specimenId);
    this.specimenService.getSectionData(this.specimen)
      .finally(() => {
        this.isSectionDataLoaded = true;
        this.setSelectedSection(nearest(this.sectionData.sections.map(s => s.section), this.sliderAttr['max'] / 2));
        console.log('SpecimenDetail data loaded.');
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
    /*
    // color-picker사용을 위해 소문자로 바꾸어야함 ?
    this.specimen.x3dModels.forEach(el => {
      el.color = el.color.toLowerCase();
    });
    */

  }

  updateModelColor(x3d) {
    const el = document.getElementById(x3d.name + '__MA');
    if (el) {
      this.renderer.setElementAttribute(el, 'diffuseColor', x3d.color);
    }
  }

  restoreModelStatus() {
    this.specimen.x3dModels.forEach(el => {
      this.renderer.setElementAttribute(
        document.getElementById(el.name + '__MA'),
        'transparency', el.transparency.toString());

      this.renderer.setElementAttribute(
        document.getElementById(el.name + '__MA'),
        'diffuseColor', el.color);
    });
  }

  setTransparency(element: X3dModel, transparency: number) {
    element.prevTransparency = element.transparency;
    element.transparency = transparency;
    this.renderer.setElementAttribute(
      document.getElementById(element.name + '__MA'),
      'transparency', element.transparency.toString());
  }

  toggleModel(x3d: X3dModel, checked: boolean){
    this.setTransparency(x3d, checked ? x3d.prevTransparency : 1);
  }

  toggleZoom() {
    const button = document.getElementById('zoom-button');
    if (this.zoomed) {
      button.style.backgroundColor = "#202021";
    } else {
      button.style.backgroundColor = "#c23621";
    }
    this.zoomed = !this.zoomed;
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
        } else if (obj.nested && !obj.multiSections) {
          const n = obj.key.indexOf('.');
          this.coordInfo[obj.key] = this.getCoordInfo(obj.color, section[obj.key.slice(0,n)][obj.key.slice(n+1)]);
        } else if (!obj.nested && obj.multiSections ) {
          this.sectionData.sections.map(d => {
            if ( d.section < this.sectionData.model.evaluating_canal_furcation) {
              const key = obj.key + '.' + d.section.toString();
              this.coordInfo[key] = this.getCoordInfo(obj.color, d[obj.key]);
            }
          });
        } else if (obj.nested && obj.multiSections ) {
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
