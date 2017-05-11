import {Component, OnInit, ElementRef, Renderer} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SpecimenService} from '../services/specimen.service';
import {Specimen, X3dModel} from '../schemas/specimen-schema';
import {SectionModelSchema, ViewSectionSchema} from '../schemas/section-schema';
import {repeatedColor} from '../shared/utils';
import {DataService} from "../services/data.service";

declare const x3dom: any;
declare const d3: any;


@Component({
  selector: 'app-specimen-detail',
  templateUrl: './specimen-detail.component.html',
  styleUrls: ['./specimen-detail.component.css']
})

export class SpecimenDetailComponent implements OnInit {

  private zoomed = false;

  private specimen: Specimen;
  private specimenId: string;

  private isLoaded = false;
  displaySectionInfo = false;

  color = '#0ff';
  modelWidth = 100;
  modelHeight = 100;

  sectionData: SectionModelSchema; // JSON
  coordIndex: ViewSectionSchema = {} ;
  coordPoints: ViewSectionSchema = {} ;
  coordColor: ViewSectionSchema = {};

  currentSection = 0;
  sectionMax: number;
  sectionMin: number;
  sectionStep: number;


  toggleSectionInfo() {
    this.displaySectionInfo = !this.displaySectionInfo;
  }
  setActiveSection(sectionLevel: number) {
    this.dataService.setActiveSection(sectionLevel);
  }

  constructor(private specimenService: SpecimenService,
              private route: ActivatedRoute,
              private router: Router,
              private renderer: Renderer,
              private dataService: DataService) {

    dataService.activeSection$.subscribe( section => {
        this.currentSection = section;
        this.setSectionContourLine(section);
    });

  }

  ngOnInit() {
    this.route.params.subscribe(params => this.specimenId = params['id']);
    this.specimen = this.specimenService.getSpecimenById(this.specimenId);
    this.specimenService.getSectionData(this.specimen)
      .finally(() => {
        this.isLoaded = true;
        console.log('SpecimenDetail data loaded.');
      })
      .subscribe(data => {
        this.sectionData = data;
        this.sectionMax = Math.max.apply(Math, data.sections.map(o => o.section));
        this.sectionMin = Math.min.apply(Math, data.sections.map(o => o.section));
        this.sectionStep = +((this.sectionMax - this.sectionMin) / (data.sections.length - 1)).toFixed(2);
      });

    x3dom.reload();
    /*
    // color-picker사용을 위해 소문자로 바꾸어야함 ??
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

  toggleModel(x3d: X3dModel, checked : boolean){
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

    const keys_outline = [
      {key : 'bdy_major_outline', color: '#00ff00', nested: false, multiSections: false, visible: false},
      {key : 'cnl_ref_major_outline', color: '#ff00ff', nested: false, multiSections: false, visible: true},
      {key : 'cnl_opp_ref_major_outline', color: '#ffff00', nested: false, multiSections: false, visible: true},
      {key : 'mindist_ref_line', color: '#00ff00', nested: false, multiSections: false, visible: true},

      {key : 'cnls_cmp_major_outline', color: '', nested: true, multiSections: false, visible: true}

      { key: 'mindist_ref_line', color : '#aa33ee', nested: false, multiSections: true, visible: false}

    ];


    const keys_line = [
    ];


    // find nearest section level
    const section = this.sectionData.sections
      .reduce((prev, curr) =>
        Math.abs(curr.section - sectionLevel) < Math.abs(prev.section - sectionLevel) ? curr : prev);

    keys_outline
      .filter(obj => obj.visible && !obj.nested && !obj.multiSections)
      .forEach(obj => {
        const coordInfo = this.getCoordInfo(obj.color, section[obj.key]);
        this.coordPoints[obj.key] = coordInfo.coordPoints;
        this.coordIndex[obj.key]  = coordInfo.coordIndex;
        this.coordColor[obj.key] = coordInfo.coordColor;
    });

    keys_outline
      .filter(obj => obj.visible && obj.nested && !obj.multiSections)
      .forEach(obj => {
        const outlines = section[obj.key];
        Object.keys(outlines).forEach(k => {
          const coordInfo = this.getCoordInfo('#aaaa00', outlines[k]);
          this.coordPoints[obj + '.' + k] = coordInfo.coordPoints;
          this.coordIndex[obj + '.' + k]  = coordInfo.coordIndex;
          this.coordColor[obj + '.' + k]  = coordInfo.coordColor;
        });
    });

    keys_outline
      .filter(obj => obj.visible && !obj.nested && obj.multiSections)
      .forEach(obj => {
        this.sectionData.sections.map(d => {
          if ( d.section < this.sectionData.model.evaluating_canal_furcation) {
            const coordInfo = this.getCoordInfo(obj.color, d[obj.key]);
            const key = obj.key + '.' + d.section.toString();
            this.coordPoints[key] = coordInfo.coordPoints;
            this.coordIndex[key]  = coordInfo.coordIndex;
            this.coordColor[key] = coordInfo.coordColor;
          }
        });
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
