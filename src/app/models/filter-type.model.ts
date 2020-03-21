export enum ImageFilterType {
  grey = 1,
  invert = 2,
  blackWhite = 3,
  noise = 4,
  nextPixel = 5
}

export const ImageFilterTypes = [
  {
    id: [ImageFilterType.grey],
    name: "Grey"
  },
  {
    id: [ImageFilterType.invert],
    name: "Invert"
  },
  {
    id: [ImageFilterType.blackWhite],
    name: "Black-white"
  },
  {
    id: [ImageFilterType.noise],
    name: "Noise"
  },
  {
    id: [ImageFilterType.nextPixel],
    name: "Neigbour brightness"
  }
];
