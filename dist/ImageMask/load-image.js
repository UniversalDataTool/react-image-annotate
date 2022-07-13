export var loadImage = function loadImage(imageSrc) {
  // Check if image is already loaded in a page element
  var image = Array.from(document.getElementsByTagName("img")).find(function (img) {
    return img.src === imageSrc;
  });
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  if (!image) {
    image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
  }

  return new Promise(function (resolve, reject) {
    image.onload = function () {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);
      var imageData = ctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
      resolve(imageData);
    };
  });
};
export default loadImage;