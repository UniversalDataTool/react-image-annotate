import { CSSProperties, useMemo, useRef, useState } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import useEventCallback from "use-event-callback";
import { ImagePosition } from "../types/common.ts";
import { MouseEvents } from "../ImageCanvas/use-mouse.ts";

const theme = createTheme();

const StyledImage = styled("img")(() => ({
  zIndex: 0,
  position: "absolute",
}));

const Error = styled("div")(() => ({
  zIndex: 0,
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  backgroundColor: "#ffffff",
  color: "#303030",
  fontWeight: "bold",
  whiteSpace: "pre-wrap",
  padding: 50,
}));

interface Props {
  imagePosition: ImagePosition | null;
  mouseEvents: MouseEvents;
  imageSrc: string | null;
  useCrossOrigin?: boolean;
  onLoad?: (props: {
    naturalWidth: number;
    naturalHeight: number;
    duration?: number;
  }) => void;
}

export default ({
  imagePosition,
  mouseEvents,
  imageSrc,
  onLoad,
  useCrossOrigin = false,
}: Props) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onImageLoaded = useEventCallback((event) => {
    const imageElm = event.currentTarget;
    if (onLoad)
      onLoad({
        naturalWidth: imageElm.naturalWidth,
        naturalHeight: imageElm.naturalHeight,
      });
  });
  const onImageError = useEventCallback(() => {
    setError(
      `Could not load image\n\nMake sure your image works by visiting ${imageSrc} in a web browser.`
    );
  });

  const stylePosition: CSSProperties = useMemo(() => {
    let width =
      (imagePosition?.bottomRight?.x ?? 0) - (imagePosition?.topLeft?.x ?? 0);
    let height =
      (imagePosition?.bottomRight?.y ?? 0) - (imagePosition?.topLeft?.y ?? 0);
    return {
      imageRendering: "pixelated",
      left: imagePosition?.topLeft?.x,
      top: imagePosition?.topLeft?.y,
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height,
    };
  }, [imagePosition]);

  if (!imageSrc) return <Error>Unable to load image</Error>;

  if (error) return <Error>{error}</Error>;

  return (
    <ThemeProvider theme={theme}>
      <StyledImage
        {...mouseEvents}
        src={imageSrc}
        ref={imageRef}
        style={stylePosition}
        onLoad={onImageLoaded}
        onError={onImageError}
        crossOrigin={useCrossOrigin ? "anonymous" : undefined}
      />
    </ThemeProvider>
  );
};
