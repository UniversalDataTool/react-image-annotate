declare module "autoseg/webworker" {
  type AutosegType = "simple" | "autoseg";
  
  export type AutosegOptions =
    | { type: "simple" }
    | { type: "autoseg"; maxClusters?: number; slicWeightFactor?: number };

  export type AutosegConfig = {
    type: AutosegType;
    maxClusters?: number;
    classColors?: number[];
    classNames: string[];
  };

  export const Autoseg: {
    setConfig: (config: AutosegConfig) => void;
    loadImage: (imageData: ImageData) => void;
    getMask: (regions: any[]) => Promise<ImageData>;
  };

  export default Autoseg;
}
