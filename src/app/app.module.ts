/* eslint-disable prettier/prettier */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';

import {
  BsDatepickerModule,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavComponent } from './shared/nav/nav.component';
import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';
import { TitleComponent } from './shared/title/title.component';

import { ContatosComponent } from './Componentes/Contatos/Contatos.component';

import { DashboardComponent } from './Componentes/Dashboard/Dashboard.component';

import { UserComponent } from './Componentes/user/user.component';
import { LoginComponent } from './Componentes/user/login/login.component';
import { PerfilComponent } from './Componentes/user/Perfil/Perfil.component';
import { PerfilDetalheComponent } from './Componentes/user/Perfil/perfil-detalhe/perfil-detalhe.component';
import { RegistrationComponent } from './Componentes/user/registration/registration.component';
import { RedesSociaisComponent } from './Componentes/redesSociais/redesSociais.component';

import { PalestrantesComponent } from './Componentes/palestrantes/palestrantes.component';
import { PalestranteListaComponent } from './Componentes/palestrantes/palestrante-lista/palestrante-lista.component';
import { PalestranteDetalheComponent } from './Componentes/palestrantes/palestrante-detalhe/palestrante-detalhe.component';

import { EventosComponent } from './Componentes/eventos/eventos.component';
import { EventoListaComponent } from './Componentes/eventos/evento-lista/evento-lista.component';
import { EventoDetalheComponent } from './Componentes/eventos/evento-detalhe/evento-detalhe.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { AccountService } from './services/account.service';

import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { HomeComponent } from './Componentes/home/home.component';





defineLocale('pt-br', ptBrLocale);
@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    PalestrantesComponent,
    PalestranteListaComponent,
    PalestranteDetalheComponent,
    PerfilComponent,
    PerfilDetalheComponent,
    RedesSociaisComponent,
    ContatosComponent,
    DashboardComponent,
    EventoDetalheComponent,
    EventoListaComponent,
    NavComponent,
    DateTimeFormatPipe,
    TitleComponent,
    LoginComponent,
    UserComponent,
    RegistrationComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
    }),
    NgxSpinnerModule,
  ],
  providers: [
    AccountService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
