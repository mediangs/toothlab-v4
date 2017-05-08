import {Component, Input, OnInit} from '@angular/core';
import {ChartService} from "../services/chart.service";
import {chartDefinitions} from "../shared/chart-definitions";

@Component({
  selector: 'app-specimen-chart',
  templateUrl: './specimen-chart.component.html',
  styleUrls: ['./specimen-chart.component.css']
})
export class SpecimenChartComponent implements OnInit {

  @Input() sectionData;
  private chartTitle;
  private chartData;
  private chartOptions;

  constructor(private chartService: ChartService) {
    chartService.activeChart$.subscribe( chartID => {
      this.drawChart(chartID);
    });
  }

  ngOnInit() {
    console.log(this.sectionData);

  }

  drawChart(chartID) {
    const v = chartDefinitions.find(data => data.id === chartID);
    this.chartTitle = v.title;
    this.chartData = this.setChartData(v.data.ref, v.data.cmps, v.data.subElement, v.data.limit);
    this.chartOptions = this.setChartOptions(v.options.xLabel, v.options.yLabel);
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
}
