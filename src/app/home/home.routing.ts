import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from './nav.component';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { RegisterComponent } from './register/register.component';
import { MainComponent } from './main/main.component';
import { EventoComponent } from './evento/evento.component';
import { LocalidadesComponent } from './localidades/localidades.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ComprobanteComponent } from './comprobante/comprobante.component';
import { ConocenosComponent } from './conocenos/conocenos.component';

import { HomeGuard } from "./_guards/home.guard";
import { AuthGuard } from "./_guards/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'evento/:id/:fecha', component: EventoComponent},
  { path: 'evento/:idFuncion/localidad/:idArea', component: LocalidadesComponent, canActivate: [AuthGuard] },
  { path: 'checkout/:id', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'paid/:token/:ern', component: ComprobanteComponent, canActivate: [AuthGuard] },
  { path: 'conocenos', component: ConocenosComponent },
  { path: 'login', component: LoginComponent, canActivate: [HomeGuard] },
  { path: 'recovery', component: RecoveryComponent, canActivate: [HomeGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [HomeGuard] },
  { path: '**', redirectTo: 'main', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
