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

  color = '#0ff';
  modelWidth = 100;
  modelHeight = 100;

  sectionData: SectionModelSchema; // JSON
  coordIndex: ViewSectionSchema = {} ;
  coordPoints: ViewSectionSchema = {} ;
  coordColor: ViewSectionSchema={};

  currentSection = 0;
  sectionMax: number;
  sectionMin: number;
  sectionStep: number;


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
    var el = document.getElementById(x3d.name + '__MA');
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
      {key : 'bdy_major_outline', color: '#00ff00'},
      {key : 'cnl_ref_major_outline', color: '#ff00ff'},
      {key : 'cnl_opp_ref_major_outline', color: '#ffff00'},
      {key : 'mindist_ref_line', color: '#00ff00'}];

    const keys_outlines = ['cnls_cmp_major_outline'];

    // find nearest section level
    const section = this.sectionData.sections
      .reduce((prev, curr) =>
        Math.abs(curr.section - sectionLevel) < Math.abs(prev.section - sectionLevel) ? curr : prev);

    keys_outline.forEach(obj => {
      const outline = section[obj.key];
      this.coordPoints[obj.key] = [].concat.apply([], outline);
      this.coordIndex[obj.key]  = Object.keys(outline).map(x => Number(x)).concat(0);
      this.coordColor[obj.key] = repeatedColor(obj.color, this.coordPoints[obj.key].length / 3);
    });

    keys_outlines.forEach(key => {
      const outlines = section[key];
      Object.keys(outlines).forEach(k => {
        const outline = outlines[k];
        this.coordPoints[key + '.' + k] = [].concat.apply([], outline);
        this.coordIndex[key + '.' + k]  = Object.keys(outline).map(x => Number(x)).concat(0);
      });
    });

    this.sectionData.sections.map(d => {
      if ( d.section < this.sectionData.model.evaluating_canal_furcation) {
        const outline = d.mindist_ref_line;
        const key = 'mindist.' + d.section.toString();
        this.coordPoints[key] = [].concat.apply([], outline);
        this.coordIndex[key]  = Object.keys(outline).map(x => Number(x)).concat(0);
        this.coordColor[key] = repeatedColor('#aa33ee', this.coordPoints[key].length / 3);
      }
    });
  }

  gotoAnatomy() {
    this.router.navigate(['/specimen-list']);
  }

  reload() {
    this.restoreModelStatus();
  }
}
