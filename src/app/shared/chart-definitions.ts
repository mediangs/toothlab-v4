export const chartDefinitions = [
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
