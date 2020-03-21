import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef
} from "@angular/core";
import { Particle } from "../models/particle.model";
import { ImageFilterType, ImageFilterTypes } from "../models/filter-type.model";
import { ParticlesService } from "../services/particles.service";
import { ImageFilter } from "../services/image-filter.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild("image") imageRef: ElementRef;
  @ViewChild("canvas") canvasRef: ElementRef;

  public image: HTMLImageElement;
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  public filterTypes = ImageFilterTypes;
  public filters: Array<ImageFilterType> = [];
  public particles: Array<Particle> = [];
  public particlesCount: number = 100;

  public moveSpeed = 100;
  public moveDistance = 10;
  public brightness = 125;
  public diff = 10;

  public imageWidth = window.innerWidth;
  public imageHeight = window.innerHeight;

  private moveInterval;
  private noiseInterval;

  public constructor(private particlesService: ParticlesService) {}

  public ngOnInit(): void {
    this.particles = this.particlesService.generateRandom(
      this.particlesCount,
      this.imageWidth,
      this.imageHeight
    );
  }

  public ngAfterViewInit() {
    this.image = this.imageRef.nativeElement;
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvasRef.nativeElement.getContext("2d");
    this.context.imageSmoothingEnabled = false;

    let image = this.image;
    image.onload = data => {
      console.log(data);

      this.imageHeight = image.height;
      this.imageWidth = image.width;

      // const rarety = 0.1;
      // this.particles = this.particlesService.generateFromImage(image, rarety);

      this.canvas.width = image.width;
      this.canvas.height = image.height;
      this.context.drawImage(image, 0, 0, image.width, image.height);
      this.applyFilters();
    };
  }

  public resetMovement() {
    this.moveParticles(this.particles, this.moveDistance);
  }

  public stopMovement() {
    cancelAnimationFrame(this.moveInterval);
  }

  public clearFilters() {
    this.filters = [];
    this.applyFilters();
  }

  public applyNoise() {
    cancelAnimationFrame(this.noiseInterval);

    this.noiseInterval = requestAnimationFrame(() => {
      const imageData = this.particlesService.getImageData(this.image);
      const filter = new ImageFilter(imageData).applyFilters(
        [...this.filters, ImageFilterType.noise],
        this.filterOptions()
      );

      this.context.putImageData(filter.imageData, 0, 0);

      this.applyNoise();
    });
  }

  public stopNoise() {
    cancelAnimationFrame(this.noiseInterval);
    this.applyFilters();
  }

  public handleFileInput(files: FileList) {
    const file = files[0];
    this.image.src = URL.createObjectURL(file);

    // const reader = new FileReader();
    // reader.onloadend = (readerData: ProgressEvent<FileReader>) => {
    //   console.log(readerData);
    // };
    // reader.readAsArrayBuffer(file);
  }

  public applyFilters() {
    const imageData = this.particlesService.getImageData(this.image);
    const filter = new ImageFilter(imageData).applyFilters(
      this.filters,
      this.filterOptions()
    );
    this.context.putImageData(filter.imageData, 0, 0);
  }

  public moveParticles(particles: Particle[], distance: number) {
    cancelAnimationFrame(this.moveInterval);

    let intevalTime = this.moveSpeed - 100;
    this.moveInterval = requestAnimationFrame(() => {
      for (let i = 0; i < particles.length; i++) {
        let xDistance = (Math.random() - 0.5) * distance;
        let yDistance = (Math.random() - 0.5) * distance;

        particles[i].x += xDistance;
        particles[i].y += yDistance;

        setTimeout(() => {
          particles[i].x -= xDistance;
          particles[i].y -= yDistance;
        }, intevalTime / 2);
      }

      this.moveParticles(particles, distance);
    });
  }

  private filterOptions() {
    return {
      brightness: this.brightness,
      diff: this.diff
    };
  }
}
