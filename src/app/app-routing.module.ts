import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ParticlesComponent } from "./particles/particles.component";
import { DiamondComponent } from './diamond/diamond.component';

const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "particles", component: ParticlesComponent },
  { path: "diamonds", component: DiamondComponent },
  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
