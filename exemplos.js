Guilherme L. Soares, [21.07.20 19:01]
const fs = require("fs");
const { createCanvas, Image, registerFont } = require("canvas");
const compress_images = require("compress-images");
const colors = require("colors");
const INPUT_path_to_your_images =
  "./banners//*.{jpg,JPG,jpeg,JPEG,png,svg,gif}";
const OUTPUT_path = "optmized_banners/";

registerFont("./fonts/OpenSans-ExtraBold.ttf", {
  family: "Open Sans",
  weight: "extra-bold",
});

/
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {String} imgBase
 * @param {String} dirName
 * @param {String} imgLogo
 * @param {String} size
 * @param {String} pos
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} hasDealName
 */

class createBanner {
  constructor(
    imgBase,
    dirName,
    imgLogo,
    size,
    pos,
    radius,
    hasDealName,
    wordsPerLine
  ) {
    this.imgBase = imgBase;
    this.imgLogo = imgLogo;
    this.dirName = dirName;
    this.posX = parseInt(pos.split("x")[0]);
    this.posY = parseInt(pos.split("x")[1]);
    this.maxWidth = parseInt(size.split("x")[0]);
    this.maxHeight = parseInt(size.split("x")[1]);
    this.radius = parseInt(radius);
    this.hasDealName = hasDealName === "TRUE";
    this.wordsPerLine = parseInt(wordsPerLine) || 10;
    this.aspectRatio;
    this.createBase();
  }

  createBase() {
    console.log(
      colors.yellow(
        `Processing ${colors.green(this.imgBase)} of ${colors.green(
          this.dirName
        )}`
      )
    );

    let base = new Image();
    base.onload = () => {
      const width = base.width;
      const height = base.height;

      this.canvas = createCanvas(width, height);
      this.context = this.canvas.getContext("2d");
      this.context.drawImage(base, 0, 0, width, height);
      this.addText();
    };
    base.src = ./examples/${this.imgBase};

    this.addLogo();
  }

  addLogo() {
    let logo = new Image();
    logo.onload = () => {
      const resizedAndRepositionedImg = this.getAspectRatio(logo);
      console.log(resizedAndRepositionedImg);
      this.createPath();
      this.context.clip();
      this.context.drawImage(
        logo,
        resizedAndRepositionedImg.posX,
        resizedAndRepositionedImg.posY,
        resizedAndRepositionedImg.width,
        resizedAndRepositionedImg.height
      );
    };
    logo.src = ./examples/logo/${this.imgLogo};
    this.createDir();
  }

  wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = this.context.measureText(testLine);
      const testWidth = metrics.width;
      const brokenLine = line.trim().split(" ").length >= this.wordsPerLine;

      if ((testWidth > maxWidth || brokenLine) && n > 0) {
        this.context.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.context.fillText(line, x, y);
  }

  addText() {
    if (!this.hasDealName) {
      return;
    }

    let textPosY;
    let lineHeight;

    if (this.imgBase.indexOf("POST") !== -1) {
      this.context.font = "bolder 90px Open Sans";
      textPosY = this.posY + this.maxHeight + 122;
      lineHeight = 95;
    } else {
      this.context.font = "bolder 130px Open Sans";
      textPosY = this.posY + this.maxHeight + 238;
      lineHeight = 145;
    }

    this.context.fillStyle = "red";
    this.context.textAlign = "center";

    const textPosX = this.canvas.width / 2;
    const maxWidth = this.canvas.width - 200;

    this.wrapText(this.dirName, textPosX, textPosY, maxWidth, lineHeight);
  }

  getNewPosition(size) {
    const posXDiff = (this.maxWidth - size.width) / 2;
    const posYDiff = (this.maxWidth - size.height) / 2;
    return {
      posX: Math.round(this.posX + posXDiff),
      posY: Math.round(this.posY + posYDiff),
    };
  }

Guilherme L. Soares, [21.07.20 19:01]
positioningImg(size) {
    if (size.height < this.maxHeight || size.width < this.maxWidth) {
      const newPosition = this.getNewPosition(size);
      return Object.assign(size, newPosition);
    }
    return Object.assign(size, { posX: this.posX, posY: this.posY });
  }

  getAspectRatio(img) {
    let newImgSize = {};
    if (img.width > this.maxWidth || img.width > img.height) {
      this.aspectRatio = this.maxWidth / img.width;
      newImgSize.width = this.maxWidth;
      newImgSize.height = Math.round(img.height * this.aspectRatio);
      return this.positioningImg(newImgSize);
    }

    if (img.height > this.maxHeight || img.height > img.width) {
      this.aspectRatio = this.maxHeight / img.height;
      newImgSize.height = this.maxHeight;
      newImgSize.width = Math.round(img.width * this.aspectRatio);
      return this.positioningImg(newImgSize);
    }
  }

  createPath() {
    this.context.beginPath();
    this.context.moveTo(this.posX + this.radius, this.posY);
    this.context.lineTo(this.posX + this.maxWidth - this.radius, this.posY);
    this.context.quadraticCurveTo(
      this.posX + this.maxWidth,
      this.posY,
      this.posX + this.maxWidth,
      this.posY + this.radius
    );
    this.context.lineTo(
      this.posX + this.maxWidth,
      this.posY + this.maxHeight - this.radius
    );
    this.context.quadraticCurveTo(
      this.posX + this.maxWidth,
      this.posY + this.maxHeight,
      this.posX + this.maxWidth - this.radius,
      this.posY + this.maxHeight
    );
    this.context.lineTo(this.posX + this.radius, this.posY + this.maxHeight);
    this.context.quadraticCurveTo(
      this.posX,
      this.posY + this.maxHeight,
      this.posX,
      this.posY + this.maxHeight - this.radius
    );
    this.context.lineTo(this.posX, this.posY + this.radius);
    this.context.quadraticCurveTo(
      this.posX,
      this.posY,
      this.posX + this.radius,
      this.posY
    );
    this.context.closePath();
  }

  createDir() {
    this.path = "banners";

    const cleanPath = this.imgLogo.replace(".jpg", "");

    if (!fs.existsSync(${this.path}/${this.dirName})) {
      fs.mkdirSync(${this.path}/${this.dirName}, { recursive: true });
    }

    this.save();
  }

  deleteDir() {
    try {
      fs.rmdirSync(this.dirName, { recursive: true });

      colors.blue(console.log(${colors.red(this.dirName)} is deleted!));
    } catch (err) {
      colors.red(
        console.error(Error while deleting ${colors.yellow(this.dirName)}.)
      );
    }
  }

  save() {
    const buffer = this.canvas.toBuffer("image/jpeg");
    const imgName = this.imgBase.replace(".jpg", "");
    if (!fs.existsSync(imgName)) {
      fs.writeFileSync(${this.path}/${this.dirName}/${imgName}.jpg, buffer);
      console.log(
        colors.yellow(
          `Processed ${colors.green(this.imgBase)} of ${colors.green(
            this.dirName
          )}`
        )
      );
    }
  }
}

function create({
  imgBase,
  dirName,
  logoDeal,
  logoDealSize,
  logoDealPosition,
  radius,
  hasDealName,
  wordsPerLine,
}) {
  // for (let index = 0; index <= 1000; index++) {
  //   const customBanner = new createBanner(
  //     imgBase,
  //     dirName + index,
  //     logoDeal,
  //     logoDealSize,
  //     logoDealPosition,
  //     radius,
  //     hasDealName
  //   );
  // }
  const customBanner = new createBanner(
    imgBase,
    dirName,
    logoDeal,
    logoDealSize,
    logoDealPosition,
    radius,
    hasDealName,
    wordsPerLine
  );

Guilherme L. Soares, [21.07.20 19:01]
// compress_images(
  //   INPUT_path_to_your_images,
  //   OUTPUT_path,
  //   { compress_force: false, statistic: true, autoupdate: true },
  //   false,
  //   { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
  //   { png: { engine: "pngquant", command: ["--quality=65-80"] } },
  //   { svg: { engine: "svgo", command: "--multipass" } },
  //   {
  //     gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
  //   },
  //   function (error, completed, statistic) {
  //     console.log("-------------");
  //     console.log(error);
  //     console.log(completed);
  //     console.log(statistic);
  //     console.log("-------------");
  //   }
  // );
  return customBanner;
}

exports.create = create;