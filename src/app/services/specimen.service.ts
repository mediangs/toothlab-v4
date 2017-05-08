import {Injectable} from '@angular/core';
import {Specimen} from '../schemas/specimen-schema';
import {SpecimenList} from '../../assets/data/specimen.data';
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {SectionModelSchema} from "../schemas/section-schema";
import {namedlist} from '../shared/utils';

@Injectable()
export class SpecimenService{

  constructor(private http : Http){}

  getSpecimenList(): Specimen[] {
      return SpecimenList;
  }

  getSpecimenById(id : string): Specimen {
      return this.getSpecimenList().find( s => s.id === id );
  }

  getSectionDataById(id: string): Observable<SectionModelSchema>{
    return this.getSectionData(this.getSpecimenById(id));
  }

  getSectionData(specimen:Specimen): Observable<SectionModelSchema>{
    return this.http.get(specimen.path + specimen.sections)
      .map(res=>res.json())
      .map(data => {
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
        return data;
      });
  }
}


