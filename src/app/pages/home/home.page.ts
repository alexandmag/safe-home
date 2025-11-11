import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Chart } from 'chart.js/auto';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('grafico1') grafico1!: ElementRef<HTMLCanvasElement>;
  public chart: any;
  public monitorados: any;
  private apiUrl = 'https://safe-home-backend.onrender.com/api/person/';

  public pessoa = {
      responsavelId: "6912527f27fea258b8a9b5dd",
      name: "Alexandre",
      cpf: "123",
      phone: "123",
      email: "asd",
      address: {
        street: "asd",
        house: 12,
        neighborhood: "centro",
        city: "bh"
      }
    };

  // public pessoa = {
  //   responsavelId: "6912527f27fea258b8a9b5dd",
  //   nome: '',
  //   cpf: '',
  //   telefone: '',
  //   email: '',
  //   address: {
  //     rua: '',
  //     numero: '',
  //     bairro: '',
  //     cidade: ''
  //   }
  // };

  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
  ) {}

  ionViewWillEnter() {
    this.getMonitorados();
  }

  ionViewDidEnter() {
    const canvas = this.grafico1.nativeElement;

    const data = {
      labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
      datasets: [
        {
          label: 'Monitorado 1',
          data: [5, 3, 2, 6, 4],
          backgroundColor: ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff'],
        },
      ],
    };

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Quedas por Monitorados' },
        },
      },
    });
  }

  configuraUsuario() {
    this.navCtrl.navigateForward('/configuracao-usuario');
  }

  async getMonitorados() {
    try {
      const res = await axios.get(`${this.apiUrl}getPersonByID/${this.pessoa.responsavelId}`);
      this.monitorados = res.data;
      console.log("✅ getMonitorados res:", this.monitorados);
    } catch (error) {
      console.error("❌ Erro ao buscar pessoa:", error);
    }
  }
  
  async adicionaMonitorado() {
    try {
      const res = await axios.post(this.apiUrl, this.pessoa);
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

  // async deletarMonitorado(id: string) {
  //   try {
  //     await axios.delete(`${this.apiUrl}${id}`);
  //     this.monitorados = this.monitorados.filter(p => p._id !== id);
  //     console.log('🗑️ Monitorado removido com sucesso');
  //   } catch (error) {
  //     console.error('❌ Erro ao remover monitorado:', error);
  //   }
  // }

  isFormValid(): boolean {
    const p = this.pessoa;
    return (
      p.name.trim() &&
      p.cpf.trim() &&
      p.phone.trim() &&
      p.email.trim() &&
      p.address.street.trim() &&
      // p.address?.house !== "" &&
      p.address.neighborhood.trim() &&
      p.address.city.trim()
    ) ? true : false;
  }

  mascararCPF(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.substring(0, 11);
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.pessoa.cpf = valor;
  }

  mascararTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.substring(0, 11);
    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
    valor = valor.replace(/(\d{5})(\d{4})$/, '$1-$2');
    this.pessoa.phone = valor;
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.isFormValid()) {
      console.log('Pessoa confirmada:', this.pessoa);
      this.modal.dismiss(this.pessoa.name, 'confirm');
      this.adicionaMonitorado();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}
