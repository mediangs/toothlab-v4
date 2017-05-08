import {Component, OnInit, ElementRef, Renderer} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SpecimenService} from '../services/specimen.service';
import {Specimen, X3dModel} from '../services/specimen-schema';
import {Http} from '@angular/http';
import {SectionModelSchema, ViewSectionSchema} from '../services/section-schema';
import {ChartService} from '../services/chart.service';
import {namedlist, repeatedColor} from '../shared/utils';

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

  private chartTitle;
  private chartData;
  private chartOptions;
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

  chartDefinitions = [
    {
      id: 0,
      viewValue: 'Dentin Thickness',
      title: 'Dentin Thickness',
      data: {ref: 'mindist_ref', cmps: 'mindists_cmp', subElement: 'thickness', limit: true},
      options: {xLabel : 'Distance from apex(mm)' , yLabel: 'Dentin thickness (mm)'}
    },
    {
      id: 1,
      viewValue: 'Canal Area',
      title : 'Canal Area',
      data: {ref: 'area_cnl_ref', cmps: 'area_cnls_cmp', subElement: null, limit:true},
      options: {xLabel : 'Distance from apex(mm)' , yLabel: 'Area (mm^2)'}
    },
    {
      id: 2,
      viewValue: 'Canal Width',
      title : 'Canal Width(narrow)',
      data: {ref: 'cnl_ref_narrow', cmps: 'cnls_cmp_narrow', subElement: 'width', limit: false},
      options: {xLabel : 'Distance from apex(mm)' , yLabel: 'Canal width (mm)'}
    },
    {
      id: 3,
      viewValue: 'Transportation',
      title : 'Canal Transportation',
      data: {ref: null, cmps: 'cnls_transportation', subElement: 'distance', limit: false},
      options: {xLabel : 'Distance from apex(mm)' , yLabel: 'Transportation (mm)'}
    },
  ];

  setActiveSection(sectionLevel: number) {
    this.chartService.setActiveSection(sectionLevel);
  }

  setActiveChartType(chartID) {
    this.chartService.setActiveChart(chartID);
  }


  drawChart(chartID) {
    const v = this.chartDefinitions.find(data => data.id === chartID);
    this.chartTitle = v.title;
    this.chartData = this.setChartData(v.data.ref, v.data.cmps, v.data.subElement, v.data.limit);
    this.chartOptions = this.setChartOptions(v.options.xLabel, v.options.yLabel);
  }

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
        if (this.isLoaded) {
          this.setIndexedLineSet(section);
        }
      }
    );
    chartService.activeChart$.subscribe(
      chartID => {
        if (this.isLoaded) {
          this.drawChart(chartID);
        }
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
      .finally(() => {
        this.isLoaded = true;
        console.log('Data loaded.');
        this.chartService.setActiveChart(this.chartDefinitions[0].id);
      })
      .subscribe(data => {
        console.log('Loading data...');

        const DentinThickness = namedlist(['p_body', 'p_canal', 'thickness', 'angle']);
        const CanalDimension = namedlist(['p1', 'p2', 'width']);
        const FileMovement = namedlist(['vector', 'angle', 'distance']);

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
        this.sectionStep = +((this.sectionMax - this.sectionMin) / (data.sections.length - 1)).toFixed(2);
      });
  }


  setChartData(ref, cmps, subElement= null, limit ) {
    const retData = [];
    if (ref) {
      retData.push({
        values: this.sectionData.sections.map(d => [d.section,
          (limit && d.section > this.sectionData.model.evaluating_canal_furcation) ? null :
            subElement ? d[ref][subElement] : d[ref]]),
        key: 'pre'
      });
    }

    if (cmps) {
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
    }
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
            // elementClick: e => this.updateSectionOutline(e[0].point[0])
            elementClick: e => this.chartService.setActiveSection(e[0].point[0])
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
    let keys_outline = [
      {key : 'bdy_major_outline', color: '#00ff00'},
      {key : 'cnl_ref_major_outline', color: '#ff00ff'},
      {key : 'cnl_opp_ref_major_outline', color: '#ffff00'},
      {key : 'mindist_ref_line', color: '#00ff00'}];

    let keys_outlines = ['cnls_cmp_major_outline'];

    // find nearest section level
    let section = this.sectionData.sections
      .reduce((prev, curr) =>
        Math.abs(curr.section - sectionLevel) < Math.abs(prev.section - sectionLevel) ? curr : prev);

    keys_outline.forEach(obj => {
      let outline = section[obj.key];
      this.coordPoints[obj.key] = [].concat.apply([], outline);
      this.coordIndex[obj.key]  = Object.keys(outline).map(x=>Number(x)).concat(0);
      this.coordColor[obj.key] = repeatedColor(obj.color, this.coordPoints[obj.key].length / 3);
    });

    keys_outlines.forEach(key=>{
      let outlines = section[key];
      Object.keys(outlines).forEach(k => {
        let outline = outlines[k];
        this.coordPoints[key+'.'+k] = [].concat.apply([], outline);
        this.coordIndex[key+'.'+k]  = Object.keys(outline).map(x=>Number(x)).concat(0);
      });
    });

    this.sectionData.sections.map(d => {
      if(d.section < this.sectionData.model.evaluating_canal_furcation) {
        let outline = d.mindist_ref_line;
        let key = 'mindist.'+d.section.toString();
        this.coordPoints[key] = [].concat.apply([], outline);
        this.coordIndex[key]  = Object.keys(outline).map(x=>Number(x)).concat(0);
        this.coordColor[key] = repeatedColor('#aa33ee', this.coordPoints[key].length / 3);
      }
    });
  }

  gotoAnatomy() {
    this.router.navigate(['/specimen-list']);
  }

  reload() {
    this.restoreModelStatus()
  }
}
