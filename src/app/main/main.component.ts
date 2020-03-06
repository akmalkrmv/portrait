import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef
} from "@angular/core";
import { Particle } from "../models/particle.model";
import { ParticlesService } from "../services/particles.service";
import { ImageFilter, ImageFilterType } from "../services/image-filter.service";

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

  public filters: Array<ImageFilterType> = [ImageFilterType.grey];
  public particles: Array<Particle> = [];
  public particlesCount: number = 100;

  public moveSpeed = 100;
  public moveDistance = 10;

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
    clearInterval(this.moveInterval);
  }

  public clearFilters() {
    this.filters = [];
    this.applyFilters();
  }

  public applyNoise() {
    this.noiseInterval = setInterval(() => {
      const imageData = this.particlesService.getImageData(this.image);
      const filter = new ImageFilter(imageData).applyFilters([
        ...this.filters,
        ImageFilterType.noise
      ]);

      this.context.putImageData(filter.imageData, 0, 0);
    }, 100);
  }

  public stopNoise() {
    clearInterval(this.noiseInterval);
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
    const filter = new ImageFilter(imageData).applyFilters(this.filters);
    this.context.putImageData(filter.imageData, 0, 0);
  }

  public moveParticles(particles: Particle[], distance: number) {
    clearInterval(this.moveInterval);

    let intevalTime = this.moveSpeed - 100;
    this.moveInterval = setInterval(() => {
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
    }, intevalTime);
  }
}
