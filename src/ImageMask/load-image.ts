export const loadImage = (imageSrc: string): Promise<ImageData> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = imageSrc;
  return new Promise((resolve) => {
    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );
      resolve(imageData);
    };
  });
};

export default loadImage;
