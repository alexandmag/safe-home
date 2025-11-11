import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class SafeHomeApi {
  private apiUrl = 'https://safe-home-backend.onrender.com/api/person/';

  constructor (
    private toastCtrl: ToastController,
  ) {}

  async getMonitorados() {
    try {
      const res = await axios.get(this.apiUrl);
      console.log("✅ getMonitorados res:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Erro ao buscar pessoa:", error);
    }
  }

  async getPessoaPorID(pessoa:any, monitorados:any) {
    try {
      const res = await axios.get(`${this.apiUrl}getPersonByID/${pessoa.responsavelId}`);
      monitorados = res.data;
      console.log("✅ getMonitorados res:", monitorados);
    } catch (error) {
      console.error("❌ Erro ao buscar pessoa:", error);
    }
  }
  
  async adicionaMonitorado(pessoa:any) {
    try {
      const res = await axios.post(this.apiUrl, pessoa);
      console.log('✅ adicionaMonitorado res:', res.data);

      const toast = await this.toastCtrl.create({
        message: 'Monitorado adicionado com sucesso!',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    } catch (error) {
      console.error('❌ Erro ao adicionar monitorado:', error);

      const toast = await this.toastCtrl.create({
        message: 'Erro ao adicionar monitorado.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  async deletarMonitorado(id: string, monitorados:any) {
    try {
      const res = await axios.delete(`${this.apiUrl}${id}`);

      monitorados = monitorados.filter((p: any) => p._id !== id);
      console.log("🗑️ Monitorado removido com sucesso:", res.data);

      const toast = await this.toastCtrl.create({
        message: 'Monitorado removido com sucesso!',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      return monitorados;
    } catch (error) {
      console.error("❌ Erro ao remover monitorado:", error);

      const toast = await this.toastCtrl.create({
        message: 'Erro ao remover monitorado.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
