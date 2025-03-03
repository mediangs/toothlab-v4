export interface Specimen {
  id: string;  //LJKMX01
  title: string;
  location: string; //Maxillary molar
  position: any,
  orientation: any,
  description?: string; //
  snapshot?: string; // LJKMX01.jpg
  sections?: string; // JSON file name, which contain section info.
  x3dModels?: Array<X3dModel>; // [root.x3d, canal-pre.x3d, canal-ptu.x3d]
  presets?: Array<any>;
  path: string;

}

export interface X3dModel {
  name: string;          // root           , canal-pre
  description?: string;   // Root Surface   , Root canal
  transparency?: number;
  prevTransparency?: number;
  color?: string; // diffuseColor="1 1 0"
  visible?: boolean;
}
