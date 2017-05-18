import {Specimen} from '../../app/schemas/specimen-schema';
const basePath = "/assets/models/anatomy/";

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
