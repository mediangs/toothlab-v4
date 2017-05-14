/**
 * Created by Lee Jongki on 2017-05-13.
 */

const colorMap = {blx: '#ff0000', ptu: '#00ff00', rcp: '#0000ff'};

export let sectionContours = [
  {key: 'bdy_major_outline', name: 'Root', color: '#00ff00',
    nested: false, multiSections: false, visible: true},
  {key: 'cnl_ref_major_outline', name: 'Canal-Pre', color: '#ff00ff',
    nested: false, multiSections: false, visible: true},
  {key: 'cnl_opp_ref_major_outline', name: '', color: '#ffff00',
    nested: false, multiSections: false, visible: true},
  {key: 'mindist_ref_line', name: 'Thinnest dentin', color: '#00ff00',
    nested: false, multiSections: true, visible: true},
  {key: 'mindist_ref_line', name: 'Thinnest dentin-All', color : '#aa33ee',
    nested: false, multiSections: true, visible: false}
];

export const nestedSectionContours = [
  {key : 'cnls_cmp_major_outline', namePrefix: 'Canal-', color: colorMap, multiSections: false, visible: true},
  {key : 'mindists_cmp_line', namePrefix: 'Mindist-', color: colorMap, multiSections: false, visible: true},
  {key : 'mesials_cmp_line', namePrefix: 'Mesial-', color: colorMap, multiSections: false, visible: false},
  {key : 'distals_cmp_line', namePrefix: 'Distal-', color: colorMap, multiSections: false, visible: false},
  {key : 'laterals_cmp_line', namePrefix: 'Lateral-', color: colorMap, multiSections: false, visible: false},
];

