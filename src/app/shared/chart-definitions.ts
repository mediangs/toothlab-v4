


export const chartDefinitions = [
  {
    id: 0,
    viewValue: 'Thinnest Dentin Thickness',
    title: 'Thinnest Dentin Thickness',
    data: {ref: 'mindist_ref', cmps: 'mindists_cmp', subElement: 'thickness', limit: true},
    options: {xLabel : 'Distance from apex(mm)' , yLabel: 'Dentin thickness (mm)', yMax: 2}
  },
  {
    id: 1,
    viewValue: 'Mesial Dentin Thickness',
    title: 'Mesial Dentin Thickness',
    data: {ref: 'mesial_ref', cmps: 'mesials_cmp', subElement: 'thickness', limit: true},
    options: {xLabel : 'Distance from apex(mm)' , yLabel: 'Dentin thickness (mm)', yMax: 2}
  },

  {
    id: 2,
    viewValue: 'Distal Dentin Thickness',
    title: 'Distal Dentin Thickness',
    data: {ref: 'distal_ref', cmps: 'distals_cmp', subElement: 'thickness', limit: true},
    options: {xLabel : 'Distance from apex(mm)' , yLabel: 'Dentin thickness (mm)', yMax: 2}
  },

  {
    id: 3,
    viewValue: 'Lateral Dentin Thickness',
    title: 'Lateral Dentin Thickness',
    data: {ref: 'lateral_ref', cmps: 'laterals_cmp', subElement: 'thickness', limit: true},
    options: {xLabel : 'Distance from apex(mm)' , yLabel: 'Dentin thickness (mm)', yMax: 2.5}
  },

  {
    id: 4,
    viewValue: 'Canal Area',
    title : 'Canal Area',
    data: {ref: 'area_cnl_ref', cmps: 'area_cnls_cmp', subElement: null, limit: true},
    options: {xLabel : 'Distance from apex(mm)' , yLabel: 'Area (mm^2)', yMax: null}
  },
  {
    id: 5,
    viewValue: 'Canal Width',
    title : 'Canal Width(narrow)',
    data: {ref: 'cnl_ref_narrow', cmps: 'cnls_cmp_narrow', subElement: 'width', limit: false},
    options: {xLabel : 'Distance from apex(mm)' , yLabel: 'Canal width (mm)', yMax: null}
  },
  {
    id: 6,
    viewValue: 'Transportation',
    title : 'Canal Transportation',
    data: {ref: null, cmps: 'cnls_transportation', subElement: 'distance', limit: false},
    options: {xLabel : 'Distance from apex(mm)' , yLabel: 'Transportation (mm)', yMax: null}
  },
];
