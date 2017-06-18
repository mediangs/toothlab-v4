import { Injectable } from '@angular/core';
import {nestedSectionContours, sectionContours} from "../shared/section-contours";
import {Subject} from "rxjs/Subject";

@Injectable()
export class SectionContourService {
  private _nestedSectionContours;
  private _sectionContours;

  // Observable source
  private sectionContoursSource = new Subject<any>();
  // Observable stream
  sectionContours$ = this.sectionContoursSource.asObservable();

  tmp = [
    {"key":"bdy_major_outline","name":"10.Root outline","color":"#00ff00","nested":false,"multiSections":false,"visible":true},
    {"key":"cnl_ref_major_outline","name":"11.Canal-pre","color":"#ff00ff","nested":false,"multiSections":false,"visible":true},
    {"key":"cnl_opp_ref_major_outline","name":"11.Canal-pre-opposite","color":"#ffff00","nested":false,"multiSections":false,"visible":true},
    {"key":"cnls_cmp_major_outline.blx","name":"12.Canal after-blx","color":"#ff0000","nested":true,"multiSections":false,"visible":true},
    {"key":"cnls_cmp_major_outline.ptu","name":"12.Canal after-ptu","color":"#00ff00","nested":true,"multiSections":false,"visible":true},
    {"key":"cnls_cmp_major_outline.rcp","name":"12.Canal after-rcp","color":"#0000ff","nested":true,"multiSections":false,"visible":true},
    {"key":"mindist_ref_line","name":"21.Thinnest dentin-pre","color":"#00ff00","nested":false,"multiSections":false,"visible":false},
    {"key":"mindists_cmp_line.blx","name":"22.Thinnest dentin-blx","color":"#ff0000","nested":true,"multiSections":false,"visible":true},
    {"key":"mindists_cmp_line.ptu","name":"22.Thinnest dentin-ptu","color":"#00ff00","nested":true,"multiSections":false,"visible":true},
    {"key":"mindists_cmp_line.rcp","name":"22.Thinnest dentin-rcp","color":"#0000ff","nested":true,"multiSections":false,"visible":true},
    {"key":"mesial_ref_line","name":"31.Mesial dentin-pre","color":"#00ff00","nested":false,"multiSections":false,"visible":false},
    {"key":"mesials_cmp_line.blx","name":"32.Mesial dentin-blx","color":"#ff0000","nested":true,"multiSections":false,"visible":false},
    {"key":"mesials_cmp_line.ptu","name":"32.Mesial dentin-ptu","color":"#00ff00","nested":true,"multiSections":false,"visible":false},
    {"key":"mesials_cmp_line.rcp","name":"32.Mesial dentin-rcp","color":"#0000ff","nested":true,"multiSections":false,"visible":false},
    {"key":"distal_ref_line","name":"41.Distal dentin-pre","color":"#00ff00","nested":false,"multiSections":false,"visible":false},
    {"key":"distals_cmp_line.blx","name":"42.Distal dentin-blx","color":"#ff0000","nested":true,"multiSections":false,"visible":false},
    {"key":"distals_cmp_line.ptu","name":"42.Distal dentin-ptu","color":"#00ff00","nested":true,"multiSections":false,"visible":false},
    {"key":"distals_cmp_line.rcp","name":"42.Distal dentin-rcp","color":"#0000ff","nested":true,"multiSections":false,"visible":false}
  ];

  constructor() {
    this._nestedSectionContours = nestedSectionContours;
    this._sectionContours = sectionContours;
  }

  initSectionContours(section) {
    this._nestedSectionContours.forEach(e => {
      this._sectionContours = this._sectionContours.concat(this.flattenNestedOutline(e, section));
    });
    this._sectionContours.sort((a, b) => a.name.localeCompare(b.name));
    return this._sectionContours;
  }

  getSectionContours() {
    return this._sectionContours;
  }

  setSectionContours(contours) {
    this._sectionContours = contours;
    this.sectionContoursSource.next(this._sectionContours);
  }

  setSectionContoursWithPreset(presets){
    /*
    const elements_example = [
      {key: 'bdy_major_outline', multiSections:false},
      {key: 'cnl_ref_major_outline', multiSections:false},
      {key: 'cnl_opp_ref_major_outline', multiSections:false},
      {key: 'mindist_ref_line', multiSections:true}
    ];
    */

    // console.log(presets);

    this._sectionContours.forEach(e => {
     // console.log(presets.find(preset => preset.key === e.key));
     e.visible = presets.find(preset => preset.key === e.key) ? true : false;
     e.multiSections = presets.find(preset => preset.multiSections && preset.key === e.key ) ? true : false;
    });

    this.sectionContoursSource.next(this._sectionContours);

    // console.log(this._sectionContours);


  }

  setSectionContoursWithMultisections(element){
    this._sectionContours.forEach(e => {
      if (e.key === element) {
        e.visible = true;
         e.multiSections = true;
      } else {
        e.multiSections = false;
      }
    });
    this.sectionContoursSource.next(this._sectionContours);
  }

  private flattenNestedOutline(outline, section) {
    const flattened = [];
    const cmps = section[outline.key];
    Object.keys(cmps).forEach( k => {
      const key = outline.key + '.' + k;
      flattened.push({
        key: key,
        name: outline.namePrefix + k,
        color : outline.color[k],
        nested: true,
        multiSections: outline.multiSections,
        visible: outline.visible
      });
    });
    return flattened;
  }
}
