import { ImageFilterType } from "../models/filter-type.model";

/**
 * ImageFilter
 */
export class ImageFilter {
  private readonly filterMap = {
    [ImageFilterType.nextPixel]: this.applyNextPixel,
    [ImageFilterType.grey]: this.applyGrey,
    [ImageFilterType.invert]: this.applyInvertColor,
    [ImageFilterType.blackWhite]: this.applyBlackWhite,
    [ImageFilterType.noise]: this.applyNoise
  };

  /**
   * ImageFilter
   * @param imageData
   */
  constructor(public imageData: ImageData) {}

  public getPixelData(image: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, image.width, image.height);

    const imageData = context.getImageData(0, 0, image.width, image.height);
    const pixelData = imageData.data;

    // console.log({ imageData, pixelData });

    return pixelData;
  }

  public applyFilters(filters: ImageFilterType[], params) {
    for (const filterType of filters) {
      this.filterMap[filterType].call(this, params);
    }

    return this;
  }

  public applyBlackWhite({ brightness = 128 }): ImageFilter {
    let pixelData = this.imageData.data;
    let filtered = new Uint8ClampedArray(this.imageData.data);

    for (let i = 0; i < pixelData.length; i += 4) {
      let ligthness = this.getLightness(
        pixelData[i],
        pixelData[i + 1],
        pixelData[i + 2]
      );

      if (ligthness > brightness) {
        // filtered[i] = 255;
        // filtered[i + 1] = 255;
        // filtered[i + 2] = 255;

        filtered[i] = filtered[i];
        filtered[i + 1] = filtered[i + 1];
        filtered[i + 2] = filtered[i + 2];
      } else {
        filtered[i] = filtered[i] - 50;
        filtered[i + 1] = filtered[i + 1] - 10;
        filtered[i + 2] = filtered[i + 2];
      }
    }

    this.imageData.data.set(filtered);

    return this;
  }

  public applyNextPixel({ diff = 10 }): ImageFilter {
    let pixelData = this.imageData.data;
    let filtered = new Uint8ClampedArray(this.imageData.data);

    for (let i = 0; i < pixelData.length - 4; i += 4) {
      let ligthness = this.getLightness(
        pixelData[i],
        pixelData[i + 1],
        pixelData[i + 2]
      );
      let ligthness2 = this.getLightness(
        pixelData[i + 4],
        pixelData[i + 5],
        pixelData[i + 6]
      );

      if (Math.abs(ligthness - ligthness2) < diff) {
        filtered[i] = 255;
        filtered[i + 1] = 255;
        filtered[i + 2] = 255;
      } else {
        filtered[i] = 0;
        filtered[i + 1] = 0;
        filtered[i + 2] = 0;
      }
      // filtered[i] = 255 - Math.abs(filtered[i] - filtered[i + 4]);
      // filtered[i + 1] = 255 - Math.abs(filtered[i + 1] - filtered[i + 5]);
      // filtered[i + 2] = 255 - Math.abs(filtered[i + 2] - filtered[i + 6]);
    }

    this.imageData.data.set(filtered);

    return this;
  }

  public applyGrey(): ImageFilter {
    let pixelData = this.imageData.data;
    let filtered = new Uint8ClampedArray(this.imageData.data);

    for (let i = 0; i < pixelData.length; i += 4) {
      let ligthness = this.getLightness(
        pixelData[i],
        pixelData[i + 1],
        pixelData[i + 2]
      );

      filtered[i] = ligthness;
      filtered[i + 1] = ligthness;
      filtered[i + 2] = ligthness;
    }

    this.imageData.data.set(filtered);

    return this;
  }

  public applyNoise({ pixelsRarety = 0.8 }): ImageFilter {
    let pixelData = this.imageData.data;
    let filtered = new Uint8ClampedArray(this.imageData.data);

    // pixelsRarety = Math.random() * 0.4 + 0.6;
    console.log(pixelsRarety);

    for (let i = 0; i < pixelData.length; i += 4) {
      if (Math.random() > pixelsRarety) {
        // alpha
        filtered[i + 3] = 0;
      }
    }

    this.imageData.data.set(filtered);

    return this;
  }

  public applyInvertColor(): ImageFilter {
    let pixelData = this.imageData.data;
    let filtered = new Uint8ClampedArray(this.imageData.data);

    for (let i = 0; i < pixelData.length; i += 4) {
      filtered[i] = 255 - pixelData[i];
      filtered[i + 1] = 255 - pixelData[i + 1];
      filtered[i + 2] = 255 - pixelData[i + 2];
    }

    this.imageData.data.set(filtered);

    return this;
  }

  private getLightness(red: number, green: number, blue: number) {
    return 0.299 * red + 0.587 * green + 0.114 * blue;
  }
}
