import ModifiedCanvas from "./ModifiedCanvas"
import { useSettings } from "../SettingsProvider";
import { AnnotatorToolEnum, Image } from "../MainLayout/types";

export type IImageViewerType = {
  allowedArea?: {
    x: number;
    y: number;
    w: number;
    h: number;
  },
  regionClsList?: (string | {
    id: string;
    label: string;
    color: string;
  })[],
  regionTagList?:Array<string>
  imageSrc: Image['src'],
  imageRegions: Image['regions']
  selectedTool?: AnnotatorToolEnum
}

export const ImageViewer = ({ allowedArea, regionClsList, regionTagList, imageSrc, imageRegions }: IImageViewerType) => {
const settings = useSettings();

  return (
    <ModifiedCanvas
          {...settings}
          key={0}
          allowedArea={allowedArea}
          regionClsList={regionClsList}
          regionTagList={regionTagList}
          regions={imageRegions || []}
          imageSrc={imageSrc || null}
          onMouseMove={(_p) => {}}
          onMouseDown={(_p) => {}}
          onMouseUp={(_p) => {}}
          onChangeRegion={(_r) => {}}
          onBeginRegionEdit={(_r) => {}}
          onCloseRegionEdit={(_r) => {}}
          onDeleteRegion={(_r) => {}}
          onImageLoaded={(_props) => {}}
          onRegionClassAdded={(_a)=> {}}
        />
  )
}

export default ImageViewer