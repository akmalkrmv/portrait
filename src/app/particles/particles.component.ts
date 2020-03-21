import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { fromEvent, merge } from "rxjs";
import { untilDestroyed } from "ngx-take-until-destroy";
import { ImageFilter } from "./../services/image-filter.service";

export class Mouse {
  x: number;
  y: number;
  radius: number = 100;

  constructor(canvas: HTMLCanvasElement) {
    // this.radius = ((canvas.height / 80) * canvas.width) / 80;
  }
}

export class Particle {
  public color: string = "rgb(200, 200, 255)";
  public size: number;
  public x: number;
  public y: number;
  public directionX: number;
  public directionY: number;

  constructor(
    public mouse: Mouse,
    public canvas: HTMLCanvasElement,
    public context: CanvasRenderingContext2D
  ) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.directionX = Math.random() * 3 + 0.5;
    this.directionY = Math.random() * 3 + 0.5;
  }

  public draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  public adjustMouse() {
    let distanceX = this.mouse.x - this.x;
    let distanceY = this.mouse.y - this.y;
    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    let adjustment = 10;
    let size = this.size * adjustment;

    if (distance < this.mouse.radius + this.size) {
      if (this.mouse.x < this.x && this.x < this.canvas.width - size) {
        this.x += adjustment;
      }
      if (this.mouse.x > this.x && this.x > size) {
        this.x -= adjustment;
      }
      if (this.mouse.y < this.y && this.y < this.canvas.height - size) {
        this.y += adjustment;
      }
      if (this.mouse.y > this.y && this.y > size) {
        this.y -= adjustment;
      }
    }
  }

  public update() {
    if (this.x < 0 || this.x > this.canvas.width) {
      this.directionX = -this.directionX;
    }
    if (this.y < 0 || this.y > this.canvas.height) {
      this.directionY = -this.directionY;
    }

    this.adjustMouse();

    this.x += this.directionX;
    this.y += this.directionY;

    this.draw();
  }
}

@Component({
  selector: "app-particles",
  templateUrl: "./particles.component.html",
  styleUrls: ["./particles.component.scss"]
})
export class ParticlesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("canvas") canvasRef: ElementRef;
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  @ViewChild("video") videoRef: ElementRef;
  public video: HTMLVideoElement;

  public mouse: Mouse;
  public particles: Particle[] = [];

  constructor() {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  ngAfterViewInit(): void {
    this.video = this.videoRef.nativeElement;
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvasRef.nativeElement.getContext("2d");

    this.adjustCanvasSize();
    this.init();
    this.animate();

    merge(fromEvent(document, "mousedown"), fromEvent(document, "touchstart"))
      .pipe(untilDestroyed(this))
      .subscribe((event: MouseEvent) => {
        let particle = new Particle(this.mouse, this.canvas, this.context);
        particle.x = event.x;
        particle.y = event.y;
        this.particles.push(particle);
      });

    fromEvent(window, "resize")
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.adjustCanvasSize();
        this.init();
      });

    fromEvent(window, "mousemove")
      .pipe(untilDestroyed(this))
      .subscribe((event: MouseEvent) => {
        this.mouse.x = event.x;
        this.mouse.y = event.y;
      });

    fromEvent(this.video, "loadeddata")
      .pipe(untilDestroyed(this))
      .subscribe((event: MouseEvent) => {
        this.adjustCanvasSize();
      });
  }

  public init() {
    let particles = [];
    // let count = (this.canvas.height * this.canvas.width) / 9000;
    let count = 50;

    for (let index = 0; index < count; index++) {
      particles.push(new Particle(this.mouse, this.canvas, this.context));
    }

    this.particles = particles;
  }

  public animate() {
    requestAnimationFrame(() => this.animate());
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.context.drawImage(
    //   this.video,
    //   0,
    //   0,
    //   this.canvas.width,
    //   this.canvas.height,
    //   0,
    //   0,
    //   this.video.clientWidth,
    //   this.video.clientHeight
    // );

    this.context.drawImage(
      this.video,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    let data = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    let filter = new ImageFilter(data).applyBlackWhite({});
    this.context.putImageData(filter.imageData, 0, 0);

    for (const particle of this.particles) {
      particle.update();
    }

    this.connect();
  }

  public connect() {
    let particles = this.particles;
    let connectDistance = (this.canvas.width / 7) * (this.canvas.height / 7);
    let distanceX, distanceY, distance, alpha;

    for (let a = 0; a < particles.length; a++) {
      for (let b = 0; b < particles.length; b++) {
        distanceX = particles[a].x - particles[b].x;
        distanceY = particles[a].y - particles[b].y;
        distance = distanceX * distanceX + distanceY * distanceY;

        if (distance < connectDistance) {
          alpha = 1 - distance / 20000;
          this.context.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          this.context.lineWidth = 1;
          this.context.beginPath();
          this.context.moveTo(particles[a].x, particles[a].y);
          this.context.lineTo(particles[b].x, particles[b].y);
          this.context.stroke();
        }
      }
    }
  }

  public adjustCanvasSize() {
    // this.canvas.width = window.innerWidth - 5;
    // this.canvas.height = window.innerHeight - 5;

    this.canvas.width = this.video.clientWidth || 400;
    this.canvas.height = this.video.clientHeight || 200;

    this.mouse = new Mouse(this.canvas);
  }
}
