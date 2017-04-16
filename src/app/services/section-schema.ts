/**
 * Created by Lee Jongki on 2017-02-10.
 * generated using :
 * http://schemaguru.snowplowanalytics.com/#
 */


export interface SectionModelSchema {
  model: {
    name: string,
    evaluating_canal: number,
    crv_name: string,
    crv_ref_length: number,
    length_buccal: number,
    length_lingual: number,
    furcation_pos_buccal: number,
    furcation_pos_lingual: number,
    median_major_axis_vector: Array<number>,
    pts_of_crv_ref: Array<Array<number>>,
    pts_of_crvs_cmp: any,
    pts_of_crv_opp_ref: Array<Array<number>>
  },
  sections: Array<SectionSchema>
}

export interface DentinThicknessSchema {
  p_body : Array<number>,
  p_canal : Array<number>,
  thickness : number,
  angle : number
}

export interface SectionSchema{

  section : number,

  bdy_major_outline : Array<Array<number>>,
  cnl_ref_major_outline : Array<Array<number>>,
  cnls_cmp_major_outline : any,
  cnls_cmp_major_p2_outline : any,
  cnl_opp_ref_major_outline : Array<Array<number>>,
  cnls_opp_cmp_major_outline : any,

  // DentinThickness(p_body, p_canal, thickness, angle)
  mindist_ref : any,
  mindists_cmp : any,

  lateral_ref : any,
  laterals_cmp : any,

  counter_lateral_ref : any,
  counter_laterals_cmp : any,

  mesial_ref : any,
  mesials_cmp : any,

  distal_ref : any,
  distals_cmp : any,

  // === Data load 후 추가항목 [pre_mindist.p_body, pre_mindist.p_canal]
  mindist_ref_line : Array<Array<number>>,
  mindists_cmp_line : object,

  lateral_ref_line : Array<Array<number>>,
  laterals_cmp_line : object,

  counter_lateral_ref_line : Array<Array<number>>,
  counter_laterals_cmp_line : object,

  mesial_ref_line : Array<Array<number>>,
  mesials_cmp_line : object,

  distal_ref_line : Array<Array<number>>,
  distals_cmp_line : object,
  // === end of Data load 후 추가항목


  // FileMovement(vector, angle, distance)
  cnl_straightening : any,
  cnls_straightened : any,
  cnls_transportation : any,

  // CanalDimension(p1, p2, width)
  cnl_ref_narrow : any,
  cnl_ref_wide : any,

  cnls_cmp_narrow : any,
  cnls_cmp_wide : any,

  area_cnl_ref : any,
  area_cnls_cmp : any,

  curvature_ref : any,
  curvatures_cmp : any,

  torsion_ref : any,
  torsions_cmp : any,

  pt_at_crv_ref : any,
  pt_at_crvs_cmp : any,
  pt_at_crv_opp_ref : any,

  CH_pt_at_crvs_cmp : any,
  CH_pt_at_CH_axis : any,
  tangential_CH_pt_at_crvs_cmp : any,
  tangential_CH_pt_at_CH_axis : any,

  t_vector_at_crv_ref : any,
  major_axis_vector : any,
  major_axis_t_vector : any,
  median_major_axis_used : any,

  bdy_major_outline_exist : any,
  cnl_ref_major_outline_exist : any,
  cnls_cmp_major_outline_exist : any,

  pt_cnl_ref_cwt : any,
  cwt_ratios : any,

  CH_ref : any,
  CHs_cmp : any
}


export interface  ViewSectionSchema{
  bdy_major_outline? : any,
  cnl_ref_major_outline? : any,
  cnls_cmp_major_outline? : any,
  cnls_cmp_major_p2_outline? : any,
  cnl_opp_ref_major_outline? : any,
  cnls_opp_cmp_major_outline? : any,
}
