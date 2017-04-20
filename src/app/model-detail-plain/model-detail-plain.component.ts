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

  private chartDataMain;
  private chartOptionsMain;

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
      });
    this.chartDataMain = this.setChartData('mindist_ref', 'mindists_cmp', 'thickness', true);
    //
    // this.dentinThicknessChart();
    this.chartOptionsMain = this.setChartOptions('Distance from apex(mm)', 'Dentin thickness (mm)');
  }

  dentinThicknessChart() {
    this.chartDataMain = this.setChartData('mindist_ref', 'mindists_cmp', 'thickness', true);
    // this.chartOptionsMain = [];
  }

  canalAreaChart() {
    this.chartDataMain = this.setChartData('area_cnl_ref', 'area_cnls_cmp', null, true);
    // this.chartOptionsMain = [];
  }

  setChartData(ref, cmps, subElement= null, limit= false ) {
    const retData = [
      {
        values: this.sectionData.sections.map(d => [d.section,
          (limit && d.section > this.sectionData.model.evaluating_canal_furcation) ? null :
            subElement ? d[ref][subElement] : d[ref]]),
        key: 'pre',
      },
    ];
    Object.keys(this.sectionData.sections[0][cmps]).forEach(k => {
      retData.push({
        // checking null
        values: this.sectionData.sections.map(d => [d.section,
          typeof d[cmps][k] === 'undefined' ||
            (limit && d.section > this.sectionData.model.evaluating_canal_furcation) ? null :
              subElement ? d[cmps][k][subElement] : d[cmps][k]]),
        key: k
      });
    });
    return retData;
  }

  setChartOptions(xLabel, yLabel) {
    return {
      chart: {
        type: 'lineChart',
        height: 200,
        margin : {top: 20, right: 40, bottom: 40, left: 80},
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]; },
        useInteractiveGuideline: true,
        xAxis: {
          axisLabel: xLabel
        },
        yAxis: {
          axisLabel: yLabel,
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
