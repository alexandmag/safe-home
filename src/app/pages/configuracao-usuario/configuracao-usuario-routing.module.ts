import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfiguracaoUsuarioPage } from './configuracao-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracaoUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracaoUsuarioPageRoutingModule {}
