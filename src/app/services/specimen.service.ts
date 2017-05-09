import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Specimen} from '../schemas/specimen-schema';
import {SpecimenList} from '../../assets/data/specimen.data';
import {SectionModelSchema} from "../schemas/section-schema";
import {namedlist} from '../shared/utils';

@Injectable()
export class SpecimenService {

  constructor(private http: Http) {}

  getSpecimenList(): Specimen[] {
      return SpecimenList;
  }

  getSpecimenById(id: string): Specimen {
      return this.getSpecimenList().find( s => s.id === id );
  }

  getSectionDataById(id: string): Observable<SectionModelSchema> {
    return this.getSectionData(this.getSpecimenById(id));
  }

  getSimpleSectionDataById(id: string): Observable<SectionModelSchema> {
    return this.getSimpleSectionData(this.getSpecimenById(id));
  }

  getSimpleSectionData(specimen: Specimen): Observable<SectionModelSchema> {
    return this.getSectionData(specimen)
      .map(data => {
        data.sections.forEach( d => {

          [ 'bdy_major_outline',
            'cnl_ref_major_outline',
            'cnls_cmp_major_outline',
            'cnls_cmp_major_p2_outline',
            'cnl_opp_ref_major_outline',
            'cnls_opp_cmp_major_outline'
          ].forEach(e => d[e] = null);

        });
        return data;
      });
  }

  getSectionData(specimen: Specimen): Observable<SectionModelSchema> {
    return this.http.get(specimen.path + specimen.sections)
      .map(res => res.json())
      .map(data => {
        const DentinThickness = namedlist(['p_body', 'p_canal', 'thickness', 'angle']);
        const CanalDimension = namedlist(['p1', 'p2', 'width']);
        const FileMovement = namedlist(['vector', 'angle', 'distance']);

        data.sections.forEach(d => {
          [
            {
              dist_ref: 'mindist_ref',
              dist_ref_line: 'mindist_ref_line',
              dists_cmp: 'mindists_cmp',
              dists_cmp_line: 'mindists_cmp_line'
            },
            {
              dist_ref: 'mesial_ref',
              dist_ref_line: 'mesial_ref_line',
              dists_cmp: 'mesials_cmp',
              dists_cmp_line: 'mesials_cmp_line'
            },
            {
              dist_ref: 'distal_ref',
              dist_ref_line: 'distal_ref_line',
              dists_cmp: 'distals_cmp',
              dists_cmp_line: 'distals_cmp_line'
            },
            {
              dist_ref: 'lateral_ref',
              dist_ref_line: 'lateral_ref_line',
              dists_cmp: 'laterals_cmp',
              dists_cmp_line: 'laterals_cmp_line'
            },
          ].forEach(e => {
            d[e.dist_ref] = DentinThickness(d[e.dist_ref]);
            d[e.dist_ref_line] = [d[e.dist_ref].p_body, d[e.dist_ref].p_canal];

            d[e.dists_cmp_line] = {};
            Object.keys(d[e.dists_cmp]).forEach(k => {
              d[e.dists_cmp][k] = DentinThickness(d[e.dists_cmp][k]);
              d[e.dists_cmp_line][k] = [d[e.dists_cmp][k].p_body, d[e.dists_cmp][k].p_canal];
            });
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


