import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfiguracaoUsuarioPageRoutingModule } from './configuracao-usuario-routing.module';

import { ConfiguracaoUsuarioPage } from './configuracao-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfiguracaoUsuarioPageRoutingModule
  ],
  declarations: [ConfiguracaoUsuarioPage]
})
export class ConfiguracaoUsuarioPageModule {}
