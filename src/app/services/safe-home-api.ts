import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SafeHomeApi {

  // ROTAS DA API
  private personUrl = 'https://safe-home-backend.onrender.com/api/person/';
  private monitoringUrl = 'https://safe-home-backend.onrender.com/api/monitoring/';

  // Subjects
  private monitoradosSubject = new BehaviorSubject<any[]>([]);
  monitorados$ = this.monitoradosSubject.asObservable();

  private incidentesSubject = new BehaviorSubject<any[]>([]);
  incidentes$ = this.incidentesSubject.asObservable();

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  /* ------------------------------------------------------
   * UTILITÁRIOS (loading + toast)
   * ------------------------------------------------------ */
  private async showLoading(message = "Carregando...") {
    const loading = await this.loadingCtrl.create({ message });
    await loading.present();
    return loading;
  }

  private async showToast(message: string, color = "primary") {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 2000
    });
    toast.present();
  }

  /* ------------------------------------------------------
   * SEÇÃO: PERSON API
   * ------------------------------------------------------ */

  /** Obter lista de monitorados */
  async getMonitorados(responsavelId: string) {
    const loading = await this.showLoading();
    try {
      const res = await axios.get(`${this.personUrl}getMonitored/${responsavelId}`);
      this.monitoradosSubject.next(res.data);
    } catch (err) {
      console.error("❌ Erro ao buscar monitorados:", err);
      this.showToast("Erro ao buscar monitorados.", "danger");
    } finally {
      loading.dismiss();
    }
  }

  /** Obter pessoa por ID */
  async getPessoaPorID(id: string) {
    const loading = await this.showLoading();
    try {
      const res = await axios.get(`${this.personUrl}getPersonByID/${id}`);
      return res.data;
    } catch (err) {
      console.error("❌ Erro ao buscar pessoa:", err);
      this.showToast("Erro ao buscar pessoa.", "danger");
    } finally {
      loading.dismiss();
    }
  }

  /** Criar monitorado */
  async adicionaMonitorado(pessoa: any) {
    const loading = await this.showLoading();
    try {
      const res = await axios.post(this.personUrl, pessoa);

      // API retorna { message, data }
      const data = res.data.data;

      // Atualiza a lista local
      this.monitoradosSubject.next([...this.monitoradosSubject.value, data]);

      this.showToast("Monitorado adicionado com sucesso!", "success");
    } catch (err) {
      console.error("❌ Erro ao adicionar monitorado:", err);
      this.showToast("Erro ao adicionar monitorado.", "danger");
    } finally {
      loading.dismiss();
    }
  }

    /** Editar um monitorado */
  async updatePerson(personId: string, body: any) {
    const loading = await this.showLoading();
    try {
      const res = await axios.put(
        `${this.personUrl}${personId}`,
        body
      );
      this.showToast("Monitorado atualizado!", "success");
      return res.data;
    } catch (err) {
      console.error("❌ Erro ao editar pessoa:", err);
      this.showToast("Erro ao editar monitorado.", "danger");
    } finally {
      loading.dismiss();
    }
  }

  /** Deletar monitorado */
  async deletarMonitorado(id?: string) {
    const loading = await this.showLoading();
    try {
      await axios.delete(`${this.personUrl}${id}`);

      const novaLista = this.monitoradosSubject.value.filter(m => m._id !== id);
      this.monitoradosSubject.next(novaLista);

      this.showToast("Monitorado removido!", "success");
    } catch (err) {
      console.error("❌ Erro ao remover monitorado:", err);
      this.showToast("Erro ao remover monitorado.", "danger");
    } finally {
      loading.dismiss();
    }
  }

  /* ------------------------------------------------------
   * SEÇÃO: MONITORING API
   * ------------------------------------------------------ */

  /** Obter incidentes de todos os monitorados do responsável */
  async getIncidentesDoResponsavel(responsavelId: string) {
    const loading = await this.showLoading();
    try {
      const res = await axios.get(
        `${this.monitoringUrl}getMonitoringByResponsibleID/${responsavelId}`
      );
      this.incidentesSubject.next(res.data);
    } catch (err) {
      console.error("❌ Erro ao buscar incidentes:", err);
      this.showToast("Erro ao carregar incidentes.", "danger");
    } finally {
      loading.dismiss();
    }
  }

  /** Obter incidentes de uma pessoa específica */
  async getIncidentesDaPessoa(personId: string) {
    const loading = await this.showLoading();
    try {
      const res = await axios.get(
        `${this.monitoringUrl}getMonitoringByPersonID/${personId}`
      );
      return res.data;
    } catch (err) {
      console.error("❌ Erro ao buscar incidentes da pessoa:", err);
      this.showToast("Erro ao carregar incidentes.", "danger");
    } finally {
      loading.dismiss();
    }
  }
}
