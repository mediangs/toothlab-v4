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
  coordInfo = {}; // coordPoints, coordIndex, coordColor

  currentSection = 0;
  sliderAttr = {};  // md-slider min, max, step


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
        this.currentSection = this.sliderAttr['max'] / 2;
        this.setSectionContourLine(this.currentSection);
        // this.dataService.setActiveSection(this.sliderAttr['max'] / 2);
        console.log('SpecimenDetail data loaded.');
      })
      .subscribe(data => {
        this.sectionData = data;
        this.sliderAttr['max'] = Math.max.apply(Math, data.sections.map(o => o.section));
        this.sliderAttr['min'] = Math.min.apply(Math, data.sections.map(o => o.section));
        this.sliderAttr['step'] = +((this.sliderAttr['max'] - this.sliderAttr['min']) / (data.sections.length - 1)).toFixed(2);
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
    const colorMap = {blx: '#ff0000', ptu: '#00ff00', rcp: '#0000ff'};
    let keys_outline = [
      {key: 'bdy_major_outline', name: 'Root', color: '#00ff00',
        nested: false, multiSections: false, visible: true},
      {key: 'cnl_ref_major_outline', name: 'Canal-Pre', color: '#ff00ff',
        nested: false, multiSections: false, visible: true},
      {key: 'cnl_opp_ref_major_outline', name: '', color: '#ffff00',
        nested: false, multiSections: false, visible: true},
      {key: 'mindist_ref_line', name: 'Thinnest dentin', color: '#00ff00',
        nested: false, multiSections: true, visible: true},
      {key: 'mindist_ref_line', name: 'Thinnest dentin-All', color : '#aa33ee',
        nested: false, multiSections: true, visible: false}
    ];
    const nested_outline = [
      {key : 'cnls_cmp_major_outline', namePrefix: 'Canal-', color: colorMap, multiSections: false, visible: true},
      {key : 'mindists_cmp_line', namePrefix: 'Mindist-', color: colorMap, multiSections: false, visible: true},
      {key : 'mesials_cmp_line', namePrefix: 'Mesial-', color: colorMap, multiSections: false, visible: true},
      {key : 'distals_cmp_line', namePrefix: 'Distal-', color: colorMap, multiSections: false, visible: true},
      {key : 'laterals_cmp_line', namePrefix: 'Lateral-', color: colorMap, multiSections: false, visible: true},
    ];

    // find nearest section level
    const section = this.sectionData.sections
      .reduce((prev, curr) =>
        Math.abs(curr.section - sectionLevel) < Math.abs(prev.section - sectionLevel) ? curr : prev);

    nested_outline.forEach(e => {
      keys_outline = keys_outline.concat(this.flattenOutline(e, section));
    });

    keys_outline
      .filter(obj => obj.visible)
      .forEach(obj => {
        if (!obj.nested && !obj.multiSections) {
          this.coordInfo[obj.key] = this.getCoordInfo(obj.color, section[obj.key]);
        }
        if (obj.nested && !obj.multiSections) {
          const n = obj.key.indexOf('.');
          this.coordInfo[obj.key] = this.getCoordInfo(obj.color, section[obj.key.slice(0,n)][obj.key.slice(n+1)]);
        }
        if (!obj.nested && obj.multiSections ) {
          this.sectionData.sections.map(d => {
            if ( d.section < this.sectionData.model.evaluating_canal_furcation) {
              const key = obj.key + '.' + d.section.toString();
              this.coordInfo[key] = this.getCoordInfo(obj.color, d[obj.key]);
            }
          });
        }
      });
  }

  flattenOutline(outline, section) {
    const flattened = [];
    const cmps = section[outline.key];
    Object.keys(cmps).forEach( k => {
      const key = outline.key + '.' + k;
      flattened.push({
        key: key,
        name: outline.prefix + k,
        color : outline.color[k],
        nested: true,
        multiSections: outline.multiSections,
        visible: outline.visible
      });
    });
    return flattened;
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
