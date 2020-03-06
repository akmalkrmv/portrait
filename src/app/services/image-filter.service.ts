export enum ImageFilterType {
  grey = 0,
  invert = 1,
  blackWhite = 2
}

/**
 * ImageFilter
 */
export class ImageFilter {
  private readonly filterMap = {
    [ImageFilterType.grey]: this.applyGrey,
    [ImageFilterType.invert]: this.applyInvertColor,
    [ImageFilterType.blackWhite]: this.applyBlackWhite
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

    console.log({ imageData, pixelData });

    return pixelData;
  }

  public applyFilters(filters: ImageFilterType[]) {
    for (const filterType of filters) {
      this.filterMap[filterType].call(this);
    }

    return this;
  }

  public applyBlackWhite(): ImageFilter {
    let pixelData = this.imageData.data;
    let filtered = new Uint8ClampedArray(this.imageData.data);

    for (let i = 0; i < pixelData.length; i += 4) {
      let ligthness = this.getLightness(
        pixelData[i],
        pixelData[i + 1],
        pixelData[i + 2]
      );

      if (ligthness < 127.5) {
        filtered[i] = 255;
        filtered[i + 1] = 255;
        filtered[i + 2] = 255;
      } else {
        filtered[i] = 0;
        filtered[i + 1] = 0;
        filtered[i + 2] = 0;
      }
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
