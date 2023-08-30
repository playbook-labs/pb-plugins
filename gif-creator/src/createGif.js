import GIFEncoder from "gif-encoder-2";
import { createCanvas, Image } from "canvas";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export async function createGif(files) {
  // find the width and height of the first image
  const [width, height] = await new Promise((resolve2) => {
    const image = new Image();
    image.onload = () => resolve2([image.width, image.height]);
    image.src = files[0];
  });

  const encoder = new GIFEncoder(width, height, "neuquant");
  encoder.start();
  encoder.setDelay(200);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // draw an image for each file and add frame to encoder
  for (const file of files) {
    var resizedFileName = "/tmp/" + uuidv4() + ".png";
    const input = (
      await axios({
        url: file,
        responseType: "arraybuffer",
      })
    ).data;
    await sharp(input)
      .resize({ width: width, height: height })
      .toFile(resizedFileName);
    await new Promise((resolve3) => {
      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
        encoder.addFrame(ctx);
        resolve3();
      };
      image.src = resizedFileName;
    });
  }
  encoder.finish();
  return encoder.out.getData();
}
