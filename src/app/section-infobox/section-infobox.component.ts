import {Component, Input, OnInit} from '@angular/core';
import {ActiveSectionService} from "../services/active-section.service";
import {SpecimenService} from "../services/specimen.service";
import {SectionModelSchema, SectionSchema} from "../schemas/section-schema";

@Component({
  selector: 'app-section-infobox',
  templateUrl: './section-infobox.component.html',
  styleUrls: ['./section-infobox.component.css']
})
export class SectionInfoboxComponent implements OnInit {

  @Input() specimenId;
  sectionData: SectionModelSchema;
  currentSection: number;
  cso: SectionSchema;
  numberFormat = '1.2-2';

  constructor(private specimenService: SpecimenService,
              private dataService: ActiveSectionService) {
    dataService.activeSection$.subscribe( section => {
      this.currentSection = +section.toFixed(2);
      this.cso = this.sectionData.sections.find(s => s.section === this.currentSection);
      // console.log(this.cso);
    });
  }

  ngOnInit() {
    this.specimenService
      .getSimpleSectionDataById(this.specimenId)
      .finally(() => {
        console.log('Section infobox data loaded.');
        // console.log(this.sectionData);
      })
      .subscribe(data => this.sectionData = data);
  }

}
