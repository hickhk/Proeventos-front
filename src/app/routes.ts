/* eslint-disable prettier/prettier */
import { Routes } from '@angular/router';
import { ContatosComponent } from './Componentes/Contatos/Contatos.component';
import { DashboardComponent } from './Componentes/Dashboard/Dashboard.component';
import { EventosComponent } from './Componentes/eventos/eventos.component';
import { EventoDetalheComponent } from './Componentes/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from './Componentes/eventos/evento-lista/evento-lista.component';
import { PalestrantesComponent } from './Componentes/palestrantes/palestrantes.component';
import { UserComponent } from './Componentes/user/user.component';
import { RegistrationComponent } from './Componentes/user/registration/registration.component';
import { LoginComponent } from './Componentes/user/login/login.component';
import { PerfilComponent } from './Componentes/user/Perfil/Perfil.component';
import { GuardGuard } from './guard/guard.guard';
import { HomeComponent } from './Componentes/home/home.component';
import { PalestranteListaComponent } from './Componentes/palestrantes/palestrante-lista/palestrante-lista.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent },
    ]
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [GuardGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          { path: 'lista', component: EventoListaComponent },
        ],
      },
      { path: 'eventos', redirectTo: 'eventos/lista', pathMatch: 'full' },
        {
        path: 'eventos',
        component: EventosComponent,
        children: [
          { path: 'detalhe', component: EventoDetalheComponent },
          { path: 'detalhe/:id', component: EventoDetalheComponent },
          { path: 'lista', component: EventoListaComponent },
        ],
      },
      { path: 'palestrantes', component: PalestrantesComponent },
      { path: 'contatos', component: ContatosComponent },
      { path: 'user/perfil', component: PerfilComponent,
        children: [
          { path: 'lista', component: PalestranteListaComponent },
        ],
     },
    ],
  },

  { path: 'home', component: HomeComponent },
  { path: '***', redirectTo: 'home', pathMatch: 'full' },
];
