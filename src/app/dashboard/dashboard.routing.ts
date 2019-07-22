import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { InboxComponent } from './inbox/inbox.component';
import { AsientosComponent } from './asientos/asientos.component';
import { EventosComponent } from './eventos/eventos.component';
import { ProfileComponent } from './profile/profile.component';
import { LocalidadesComponent } from './localidades/localidades.component';
import { EncuestasComponent } from './encuestas/encuestas.component';

import { AuthGuard } from "../home/_guards/auth.guard";

const routes: Routes = [
  { path: 'home', component: HomeComponent , canActivate: [AuthGuard]  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]  },
  { path: 'eventos', component: EventosComponent },
  { path: 'encuesta', component: EncuestasComponent },
  { path: 'asientos', component: AsientosComponent },
  { path: 'localidades', component: LocalidadesComponent },
  { path: 'inbox', component: InboxComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
  { path: '', redirectTo: 'home' , pathMatch: 'full'},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
