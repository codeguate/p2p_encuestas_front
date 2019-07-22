import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadersCssModule } from 'angular2-loaders-css';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { DataTableModule } from 'angular-6-datatable';
import { DashboardRoutingModule } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { ChartsModule } from 'ng2-charts';
import {TooltipModule} from 'ng2-tooltip-directive';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { UsersService } from './../home/_services/users.service';
import { AuthGuard } from './../home/_guards/auth.guard';
import { HomeGuard } from './../home/_guards/home.guard';
import { GlobalsService } from '../home/_services/globals.service';
import { AuthService } from '../home/_services/auth.service';

import { LoaderComponent } from './loader/loader.component';
import { InboxComponent } from './inbox/inbox.component';
import { HomeComponent } from './home/home.component';

import { BlockUIModule } from 'ng-block-ui';
import { EventosComponent } from './eventos/eventos.component';
import { LocalidadesComponent } from './localidades/localidades.component';
import { AsientosComponent } from './asientos/asientos.component';
import { ProfileComponent } from './profile/profile.component';
import { NguiMapModule} from '@ngui/map';
import { EncuestasComponent } from './encuestas/encuestas.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SimpleNotificationsModule.forRoot(),
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCdJAwErIy3KmcE_EfHACIvL0Nl1RjhcUo'}),
    BlockUIModule,
    LoadersCssModule,
    DataTableModule,
    ChartsModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent,
    LoaderComponent,
    InboxComponent,
    HomeComponent,
    EventosComponent,
    LocalidadesComponent,
    AsientosComponent,
    ProfileComponent,
    EncuestasComponent,
  ],
  providers:[
    AuthGuard,
    UsersService,
    HomeGuard,
    GlobalsService,
    AuthService,

  ]
})
export class DashboardModule { }
