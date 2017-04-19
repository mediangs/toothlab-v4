import {Component, OnInit, ElementRef, Renderer} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SpecimenService} from '../services/specimen.service';
import {Specimen, X3dModel} from '../services/specimen-schema';
import {Http} from '@angular/http';
import {SectionModelSchema, ViewSectionSchema} from '../services/section-schema';
import {ChartService} from '../services/chart.service';
import {namedlist} from '../shared/utils';

declare const x3dom: any;
declare const d3: any;


@Component({
  selector: 'app-model-detail-plain',
  templateUrl: './model-detail-plain.component.html',
  styleUrls: ['./model-detail-plain.component.css']
})

export class ModelDetailPlainComponent implements OnInit {

  private title = 'Root canal anatomy detail';
  private zoomed = false;

  private specimen: Specimen;
  private specimenId: string;


  private chartOptionsDist;
  private chartOptionsArea;
  private chartOptionsTransportation;
  private chartDataDist;
  private chartDataArea;
  private chartDataTransportation;

  color = '#0ff';
  modelWidth = 100;
  modelHeight = 100;

  sectionData: SectionModelSchema; // JSON
  coordIndex: ViewSectionSchema = {} ;
  coordPoints: ViewSectionSchema = {} ;

  currentSection = 0;
  sectionMax: number;
  sectionMin: number;
  sectionStep: number;


  constructor(private specimenService: SpecimenService,
              private route: ActivatedRoute,
              private router: Router,
              private renderer: Renderer,
              private chartService : ChartService,
              private el: ElementRef,
              private http: Http) {
    chartService.activeSection$.subscribe(
      section => {
        this.currentSection = section;
      }
    );
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.specimenId = params['id'];
      this.specimen = this.specimenService.getSpecimenById(this.specimenId);
    });


    // color-picker사용을 위해 소문자로 바꾸어야함 ??
    this.specimen.x3dModels.forEach(el => {
      el.color = el.color.toLowerCase();
    });

    x3dom.reload();

    this.specimenService.getSectionData(this.specimen)
      .subscribe(data => {

        const DentinThickness = namedlist(['p_body', 'p_canal', 'thickness', 'angle']);
        const CanalDimension = namedlist(['p1', 'p2', 'width']);
        const FileMovement = namedlist(['vector', 'angle']);

        data.sections.forEach(d => {
          d.mindist_ref = DentinThickness(d.mindist_ref);
          d.mindist_ref_line = [d.mindist_ref.p_body, d.mindist_ref.p_canal];

          d.mindists_cmp_line = {};
          Object.keys(d.mindists_cmp).forEach(k => {
            d.mindists_cmp[k] = DentinThickness(d.mindists_cmp[k]);
            d.mindists_cmp_line[k] = [d.mindists_cmp[k].p_body, d.mindists_cmp[k].p_canal];
          });

          d.cnl_ref_narrow = CanalDimension(d.cnl_ref_narrow);
          d.cnl_ref_wide = CanalDimension(d.cnl_ref_wide);

          Object.keys(d.cnls_cmp_narrow).forEach(k => {d.cnls_cmp_narrow[k] = CanalDimension(d.cnls_cmp_narrow[k]); });
          Object.keys(d.cnls_cmp_wide).forEach(k => {d.cnls_cmp_wide[k] = CanalDimension(d.cnls_cmp_wide[k]); });

          d.cnl_straightening = FileMovement(d.cnl_straightening);
          Object.keys(d.cnls_transportation).forEach(k => {d.cnls_transportation[k] = FileMovement(d.cnls_transportation[k])});
          Object.keys(d.cnls_straightened).forEach(k => {d.cnls_straightened[k] = FileMovement(d.cnls_straightened[k])});
        });

        this.sectionData = data;
        this.sectionMax = Math.max.apply(Math, data.sections.map(o => o.section));
        this.sectionMin = Math.min.apply(Math, data.sections.map(o => o.section));
        this.sectionStep = (this.sectionMax - this.sectionMin) / (data.sections.length - 1);

        this.setChartDataDist(data);
        this.setChartDataArea(data);
        this.setChartDataTransportation(data);
      });

    this.setChartOptionsDist();
    this.setChartOptionsArea();
  
  }

  setChartDataArea(data: SectionModelSchema) {
    this.chartDataArea = [
      {
        values: data.sections.map(d => [d.section, d.area_cnl_ref]),
        key: 'Canal area, Pre (mm2)',
      },
    ];
    Object.keys(data.sections[0].area_cnls_cmp).forEach(k => {
      this.chartDataArea.push({
        // checking null
        values: data.sections.map(d => [d.section,
          typeof d.area_cnls_cmp[k] === 'undefined' ? null : d.area_cnls_cmp[k]]),
        key: k
      });
    });
  }

  setChartDataTransportation(data: SectionModelSchema) {
    this.chartDataTransportation = [];
    Object.keys(data.sections[0].cnls_transportation).forEach(k => {
      this.chartDataTransportation.push({
        value: data.sections.map(d => [d.section,
          typeof d.cnls_transportation[k] === 'undefined' ? null : d.cnls_transportation[k]]),
        key : k
      });
    });
  }

  setChartDataDist(data: SectionModelSchema) {
    this.chartDataDist = [
      {
        values: data.sections.map(d => [d.section,
          d.section < data.model.evaluating_canal_furcation ? d.mindist_ref.thickness : null]),
        key: 'Thinnest dentin(pre)', // key  - the name of the series.
        color: '#ff7f0e'  // color - optional: choose your own line color.
      },
    ];

    Object.keys(data.sections[0].mindists_cmp).forEach(k => {
      this.chartDataDist.push({
        // checking null
        values: data.sections.map(d => [d.section,
          d.section < data.model.evaluating_canal_furcation ?
            (typeof d.mindists_cmp[k] === 'undefined' ? null : d.mindists_cmp[k].thickness) : null ]),
        key : k
      });
    });
  }

  setChartOptionsDist() {
    this.chartOptionsDist = {
      chart: {
        type: 'lineChart',
        height: 200,
        margin : {top: 20, right: 40, bottom: 40, left: 80},
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]; },
        useInteractiveGuideline: true,
        xAxis: {
          axisLabel: 'Distance from apex(mm)'
        },
        yAxis: {
          axisLabel: 'Dentin thickness (mm)',
          tickFormat: function(d){ return d3.format('.02f')(d); },
          axisLabelDistance: -1
        },
        lines: {
          dispatch: {
            elementClick: e => this.updateSectionOutline(e[0].point[0])
          }
        }
      }
    };
  }


  setChartOptionsArea() {
    this.chartOptionsArea = {
      chart: {
        type: 'lineChart',
        height: 200,
        margin : {top: 20, right: 40, bottom: 40, left: 80},
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]; },
        useInteractiveGuideline: true,
        xAxis: {
          axisLabel: 'Distance from apex(mm)'
        },
        yAxis: {
          axisLabel: 'Area(mm^2)',
          tickFormat: function(d){ return d3.format('.02f')(d); },
          axisLabelDistance: -1
        },
        lines: {
          dispatch: {
            elementClick: e => this.updateSectionOutline(e[0].point[0])
          }
        }
      }
    };
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

  toggleModel(x3d : X3dModel, checked : boolean){
    this.setTransparency(x3d, checked ? x3d.prevTransparency : 1);
  }

  updateSectionOutline(sectionLevel){
    this.currentSection = sectionLevel;
    this.setIndexedLineSet(this.currentSection);
  }

  toggleZoom() {

    var button = document.getElementById('zoom-button');
    if (this.zoomed) {
      button.style.backgroundColor = "#202021";
    } else {
      button.style.backgroundColor = "#c23621";
    }

    this.zoomed = !this.zoomed;

  }


  setIndexedLineSet(sectionLevel) {
    var keys_outline = ['bdy_major_outline',
                'cnl_ref_major_outline',
                'mindist_ref_line'];

    // find nearest section level
    var section = this.sectionData.sections
      .reduce((prev, curr) =>
        Math.abs(curr.section - sectionLevel) < Math.abs(prev.section - sectionLevel) ? curr : prev);

    keys_outline.forEach(key => {
      var outline = section[key];
      this.coordPoints[key] = [].concat.apply([], outline);
      this.coordIndex[key]  = Object.keys(outline).map(x=>Number(x)).concat(0);
    });


  }

  gotoAnatomy() {
    this.router.navigate(['/specimen-list']);
  }

  reload() {
    this.restoreModelStatus()
  }
}
