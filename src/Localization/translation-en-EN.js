const translationEnEN = {
    "menu.classifications": "Classifications",
    "menu.history": "History",
    "menu.regions": "Regions",
    "error.image":      `Could not load image\n\nMake sure your image works by visiting ${imageSrc || videoSrc
    } in a web browser. If that URL works, the server hosting the URL may be not allowing you to access the image from your current domain. Adjust server settings to enable the image to be viewed.${!useCrossOrigin
      ? ""
      : `\n\nYour image may be blocked because it's not being sent with CORs headers. To do pixel segmentation, browser web security requires CORs headers in order for the algorithm to read the pixel data from the image. CORs headers are easy to add if you're using an S3 bucket or own the server hosting your images.`
    }\n\n If you need a hand, reach out to the community at universaldatatool.slack.com`
};

export default translationEnEN;