import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Necklace } from "../models/necklace.model";

@Component({
  selector: "app-necklace",
  templateUrl: "./necklace.component.html",
  styleUrls: ["./necklace.component.scss"]
})
export class NecklaceComponent implements OnInit {
  @Input() necklace: Necklace;
  @Output() onCut = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  cut(index: number) {
    this.onCut.emit({ necklace: this.necklace, index });
  }
}
