import { Component, OnInit } from "@angular/core";
import { Necklace } from "../models/necklace.model";
import { Diamond, DiamondCollection } from "../models/diamond.model";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";

@Component({
  selector: "app-diamond",
  templateUrl: "./diamond.component.html",
  styleUrls: ["./diamond.component.scss"]
})
export class DiamondComponent implements OnInit {
  allNecklaces: any[] = [];
  necklaces: Necklace[] = [];
  catNecklaces: Necklace[] = [];
  dogNecklaces: Necklace[] = [];
  cat: Diamond[];
  dog: Diamond[];

  diamondsCount: number = 3;
  diamondTypesCount: number = 3;

  cuts: number = this.diamondTypesCount;
  availableDiamonds: { diamond: Diamond; count: number }[] = [];
  isOver: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (localStorage.getItem("diamondsCount")) {
      this.diamondsCount = Math.max(
        this.diamondsCount,
        parseInt(localStorage.getItem("diamondsCount"))
      );
    }

    this.start();
  }

  cutNecklace(necklace: Necklace, index: number) {
    if (this.cuts < 1) {
      return;
    }

    let newNecklace = { diamonds: necklace.diamonds.splice(index + 1) };
    this.necklaces.push(newNecklace);

    this.cuts--;
  }

  drop(event: CdkDragDrop<Necklace[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.cat = this.countDiamonds(this.catNecklaces);
      this.dog = this.countDiamonds(this.dogNecklaces);
      this.isOver = this.isGameOver();
    }
  }

  next() {
    this.diamondsCount++;
    this.start();
  }

  prev() {
    this.diamondsCount--;
    this.start();
  }

  restart() {
    this.start();
  }

  start() {
    localStorage.setItem("diamondsCount", this.diamondsCount.toString());

    this.diamondTypesCount = Math.max(2, Math.floor(this.diamondsCount / 3));
    this.cuts = this.diamondTypesCount;
    this.isOver = false;

    let diamonds = this.generateDiamonds(
      this.diamondsCount,
      this.diamondTypesCount
    );

    this.necklaces = [{ diamonds }];
    this.catNecklaces = [];
    this.dogNecklaces = [];
    this.allNecklaces = [this.catNecklaces, this.necklaces, this.dogNecklaces];

    this.cat = this.countDiamonds(this.catNecklaces);
    this.dog = this.countDiamonds(this.dogNecklaces);
  }

  getCorrectColor(diamond: Diamond) {
    const found = this.availableDiamonds.find(
      d => d.diamond.name == diamond.name
    );
    return found.count == diamond.count ? "yellowgreen" : "red";
  }

  private generateDiamonds(count: number, types: number): Diamond[] {
    const diamonds = [];
    this.availableDiamonds = [];

    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * types);
      const diamond = DiamondCollection[index];

      diamonds.push(diamond);
      diamonds.push(diamond);

      const availableDiamond = this.availableDiamonds[index];
      this.availableDiamonds[index] = availableDiamond
        ? { diamond, count: availableDiamond.count + 1 }
        : { diamond, count: 1 };
    }

    return this.shuffleArray(diamonds);
  }

  private shuffleArray<T>(arr: T[]): T[] {
    let array = arr.slice();

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  private countDiamonds(necklaces: Necklace[]): Diamond[] {
    let diamondKeys = {};

    for (const necklace of necklaces) {
      for (const diamond of necklace.diamonds) {
        diamondKeys[diamond.name] = diamondKeys[diamond.name]
          ? diamondKeys[diamond.name] + 1
          : 1;
      }
    }

    return Object.keys(diamondKeys)
      .sort()
      .map(key => ({ name: key, count: diamondKeys[key] }));
  }

  private isGameOver(): boolean {
    if (this.necklaces.length > 0) {
      return false;
    }

    if (this.cat.length !== this.dog.length) {
      return false;
    }

    for (let index = 0; index < this.cat.length; index++) {
      if (this.cat[index].count !== this.dog[index].count) return false;
    }

    return true;
  }
}
