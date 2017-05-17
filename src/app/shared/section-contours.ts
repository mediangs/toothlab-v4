/**
 * Created by Lee Jongki on 2017-05-13.
 */

const colorMap = {blx: '#ff0000', ptu: '#00ff00', rcp: '#0000ff'};

export let sectionContours = [
  {key: 'bdy_major_outline', name: '10.Root outline', color: '#00ff00',
    nested: false, multiSections: false, visible: true},
  {key: 'cnl_ref_major_outline', name: '11.Canal-pre', color: '#ff00ff',
    nested: false, multiSections: false, visible: true},
  {key: 'cnl_opp_ref_major_outline', name: '11.Canal-pre-opposite', color: '#ffff00',
    nested: false, multiSections: false, visible: true},
  {key: 'mindist_ref_line', name: '21.Thinnest dentin-pre', color: '#00ff00',
    nested: false, multiSections: false, visible: false},
  {key: 'mesial_ref_line', name: '31.Mesial dentin-pre', color: '#00ff00',
    nested: false, multiSections: false, visible: false},
  {key: 'distal_ref_line', name: '41.Distal dentin-pre', color: '#00ff00',
    nested: false, multiSections: false, visible: false},
  // {key: 'mindist_ref_line', name: 'Thinnest dentin-All', color : '#aa33ee',
  //  nested: false, multiSections: true, visible: false}
];

export const nestedSectionContours = [
  {key : 'cnls_cmp_major_outline', namePrefix: '12.Canal after-', color: colorMap, multiSections: false, visible: true},
  {key : 'mindists_cmp_line', namePrefix: '22.Thinnest dentin-', color: colorMap, multiSections: false, visible: true},
  {key : 'mesials_cmp_line', namePrefix: '32.Mesial dentin-', color: colorMap, multiSections: false, visible: false},
  {key : 'distals_cmp_line', namePrefix: '42.Distal dentin-', color: colorMap, multiSections: false, visible: false},
  // {key : 'laterals_cmp_line', namePrefix: 'Lateral dentin-', color: colorMap, multiSections: false, visible: false},
];

