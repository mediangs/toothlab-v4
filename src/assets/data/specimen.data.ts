import {Specimen} from '../../app/schemas/specimen-schema';
const basePath = "/assets/models/anatomy/";

const defaultPosition = "-20.96177 -3.05639 1.59837";
const defaultOrientation = "-0.50839 -0.58356 0.63325 2.14580";

export const SpecimenList: Specimen[] =
[
    {
        id: "LJKCS10",
        location: "Mandibular first molar, mesial root",
        title: 'Superimposition of three instrumented canals',
        description:"Three kinds of NiTi file, Protaper Universal, Reciproc and BLX, " +
        "were used to instrument same replicated mandibular first molar model." +
        "Then, the micro-CT image of instrumented models were superimposed for analysis.",
        snapshot: "snapshot.jpg",
        sections: "sections.json",
        position: defaultPosition,
        orientation: defaultOrientation,
        presets : [
          {
            id: 0,
            description: "Default view",
            snapshot: "preset0.jpg",
            specimen: {
              position: defaultPosition,
              orientation: defaultOrientation,
              visibleX3dModels: ["root", "canal_pre", "canal_axis"],
            },
            visibleSectionContours: [
              {key: 'bdy_major_outline', multiSections:false},
              {key: 'cnl_ref_major_outline', multiSections:false},
              {key: 'cnl_opp_ref_major_outline', multiSections:false},
              {key: 'cnls_cmp_major_outline.blx', multiSections:false},
              {key: 'cnls_cmp_major_outline.ptu', multiSections:false},
              {key: 'cnls_cmp_major_outline.rcp', multiSections:false},
              {key: 'mindist_ref_line', multiSections:false}
            ]
          },
          {
            id: 1,
            description: "Section view",
            snapshot: "preset1.jpg",
            activeSection: 10,
            specimen: {
              position: "0.33352 1.80544 -8.50497",
              orientation: "0.66910 0.73424 0.11487 3.15240",
              visibleX3dModels: [],
            },
            visibleSectionContours: [
              {key: 'bdy_major_outline', multiSections:false},
              {key: 'cnl_ref_major_outline', multiSections:false},
              {key: 'cnl_opp_ref_major_outline', multiSections:false},
              {key: 'cnls_cmp_major_outline.blx', multiSections:false},
              {key: 'cnls_cmp_major_outline.ptu', multiSections:false},
              {key: 'cnls_cmp_major_outline.rcp', multiSections:false},
              {key: 'mindist_ref_line', multiSections:false},
              {key: 'mindists_cmp_line.blx', multiSections:false},
              {key: 'mindists_cmp_line.ptu', multiSections:false},
              {key: 'mindists_cmp_line.rcp', multiSections:false},
            ]
          },

          {
            id: 2,
            description: "Thinnest dentin(pre)",
            snapshot: "preset1.jpg",
            activeSection: 10,
            specimen: {
              position: "-7.76132 19.56505 2.87449",
              orientation: "-0.96051 -0.19172 0.20163 1.47196",
              visibleX3dModels: ["canal_pre", "canal_axis"],
            },
            visibleSectionContours: [
              {key: 'bdy_major_outline', multiSections:false},
              {key: 'cnl_ref_major_outline', multiSections:false},
              {key: 'cnl_opp_ref_major_outline', multiSections:false},
              {key: 'mindist_ref_line', multiSections:true}
            ]
          },
          {
            id: 3,
            description: "Thinnest dentin(blx)",
            snapshot: "preset2.jpg",
            activeSection: 10,
            specimen: {
              position: "-7.76132 19.56505 2.87449",
              orientation: "-0.96051 -0.19172 0.20163 1.47196",
              visibleX3dModels: ["canal_pre", "canal_axis", "canal_axis_blx"],
            },
            visibleSectionContours:[
              {key: 'bdy_major_outline', multiSections:false},
              {key: 'cnl_ref_major_outline', multiSections:false},
              {key: 'cnls_cmp_major_outline.blx', multiSections:false},
              {key: 'cnl_opp_ref_major_outline', multiSections:false},
              {key: 'mindists_cmp_line.blx', multiSections:true}
            ]
          },

          {
            id: 4,
            description: "Thinnest dentin(ptu)",
            snapshot: "preset3.jpg",
            activeSection: 10,
            specimen: {
              position: "-7.76132 19.56505 2.87449",
              orientation: "-0.96051 -0.19172 0.20163 1.47196",
              visibleX3dModels: ["canal_pre", "canal_axis", "canal_axis_ptu"],
            },
            visibleSectionContours:[
              {key: 'bdy_major_outline', multiSections:false},
              {key: 'cnl_ref_major_outline', multiSections:false},
              {key: 'cnls_cmp_major_outline.ptu', multiSections:false},
              {key: 'cnl_opp_ref_major_outline', multiSections:false},
              {key: 'mindists_cmp_line.ptu', multiSections:true}
            ]
          },
          {
            id: 5,
            description: "Thinnest dentin(rcp)",
            snapshot: "preset3.jpg",
            activeSection: 10,
            specimen: {
              position: "-7.76132 19.56505 2.87449",
              orientation: "-0.96051 -0.19172 0.20163 1.47196",
              visibleX3dModels: ["canal_pre", "canal_axis", "canal_axis_rcp"],
            },
            visibleSectionContours:[
              {key: 'bdy_major_outline', multiSections:false},
              {key: 'cnl_ref_major_outline', multiSections:false},
              {key: 'cnls_cmp_major_outline.rcp', multiSections:false},
              {key: 'cnl_opp_ref_major_outline', multiSections:false},
              {key: 'mindists_cmp_line.rcp', multiSections:true}
            ]
          },

        ],
        x3dModels: [
            {
                name: "root",
                description: "Root surface",
                transparency: 0.8,
                color: "#0000ff", //  "0 0 1"
                visible: true
            },

            {
                name: "canal_pre",
                description: "Root canal",
                transparency: 0.7,
                color: "#00ff00", // "0 1 0"
                visible: true
            },

            {
                name: "canal_axis",
                description: "Canal axis",
                transparency: 0.5,
                color: "#ff0000", //"1 0 0"
                visible: false
            },

            {
                name: "canal_axis_blx",
                description: "Canal axis by BLX file",
                transparency: 0.5,
                color: "#00ff00",
                visible: false
            },
            {
                name: "canal_axis_ptu",
                description: "Canal axis by ProTaper",
                transparency: 0.5,
                color: "#0000ff", //"0 0 1"
                visible: false
            },
            {
                name: "canal_axis_rcp",
                description: "Canal axis by Reciproc",
                transparency: 0.5,
                color: "#ffff00", //"1 1 0"
                visible: false
            }

        ],
        path: basePath + "ljkcs10/"
    },

    {
        id: "LJKCS01",
        title: 'Sample mandibular molar',
        location: "Mandibular first molar, mesial root",
        description:"Mandibular first molar with short curved canal",
        snapshot: "snapshot.jpg",
        position: defaultPosition,
        orientation: defaultOrientation,
        x3dModels: [
            {
                name: "root",
                description: "Root surface",
                transparency: 0.9,
                color: "#0000ff", // "0 0 1"
                visible: true
            },

            {
                name: "canal_pre",
                description: "Root canal",
                transparency: 0.5,
                color: "#00ff00", // "0 1 0"
                visible: true
            }
        ],
        path: basePath +"ljkcs01/"
    }
];
