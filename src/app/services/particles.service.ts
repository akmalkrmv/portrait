import { Injectable } from "@angular/core";
import { Particle } from "../models/particle.model";

@Injectable({ providedIn: "root" })
export class ParticlesService {
  generateFromImage(
    image: HTMLImageElement,
    raretyPercent: number = 1
  ): Particle[] {
    const pixelData = this.getPixelData(image);

    let particles: Particle[] = [],
      i = 0,
      x = 0,
      y = 0;

    for (; i < pixelData.length; i += 4, x++) {
      if (x >= image.width) {
        x = 0;
        y++;
      }

      if (Math.random() > raretyPercent) {
        continue;
      }

      // if (
      //   i % 8 == 0 ||
      //   i % 12 == 0 ||
      //   i % 20 == 0 ||
      //   i % 28 == 0 ||
      //   i % 36 == 0 ||
      //   i % 44 == 0 ||
      //   i % 52 == 0 ||
      //   i % 68 == 0 ||
      //   i % 76 == 0 ||
      //   i % 92 == 0 ||
      //   i % 108 == 0
      // ) {
      //   continue;
      // }

      // let ligthness = this.getLigthness(
      //   pixelData[i],
      //   pixelData[i + 1],
      //   pixelData[i + 2]
      // );

      // if (ligthness < 180) {
      //   particles.push(new Particle(x, y));
      // }

      let color = `rgba(${pixelData[i]}, ${pixelData[i + 1]}, ${
        pixelData[i + 2]
      },${pixelData[i + 3]})`;

      particles.push(new Particle(x, y, color));
    }

    return particles;
  }

  generateRandom(
    count: number,
    width: number,
    height: number,
    raretyPercent: number = 1
  ): Particle[] {
    let particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      if (Math.random() > raretyPercent) {
        continue;
      }

      let particle = new Particle(
        Math.random() * width,
        Math.random() * height
      );

      particles.push(particle);
    }

    return particles;
  }

  getPixelData(image: HTMLImageElement) {
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

  public filterBlackWhite(pixelData: Uint8ClampedArray): Uint8ClampedArray {
    let filtered = new Uint8ClampedArray(pixelData);

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

    return filtered;
  }

  public filterGrey(pixelData: Uint8ClampedArray): Uint8ClampedArray {
    let filtered = new Uint8ClampedArray(pixelData);

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

    return filtered;
  }

  public filterInverеColor(pixelData: Uint8ClampedArray): Uint8ClampedArray {
    let filtered = new Uint8ClampedArray(pixelData);

    for (let i = 0; i < pixelData.length; i += 4) {
      filtered[i] = 255 - pixelData[i];
      filtered[i + 1] = 255 - pixelData[i + 1];
      filtered[i + 2] = 255 - pixelData[i + 2];
    }

    return filtered;
  }

  getLightness(red: number, green: number, blue: number) {
    return 0.299 * red + 0.587 * green + 0.114 * blue;
  }
}
