import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Chart } from 'chart.js/auto';
import { AlertController, IonModal, ModalController, NavController } from '@ionic/angular';
import { SafeHomeApi } from './../../services/safe-home-api';

// TIPOS SIMPLES
export interface Responsavel {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  address: {
    street: string;
    house: number;
    neighborhood: string;
    city: string;
  };
}

export interface Monitorado {
  _id?: string;
  responsavelId: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  address: {
    street: string;
    house: number | null;
    neighborhood: string;
    city: string;
  };
}

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
  public monitorados: Monitorado[] = [];
  public incidentes: any[] = [];
  public modoEdicao = false;
  public monitoradoEditando: any = null;

  // =========================================
  // RESPONSÁVEL LOGADO (FIXO)
  // =========================================
  public responsavelId: string = '6913eecd35da611bdbf893ef';

  public responsavel: Responsavel = {
    name: 'Alexandre',
    cpf: '123.456.789-10',
    phone: '(31) 99999-9999',
    email: 'alexandre@mail.com',
    address: {
      street: 'Rua Teste',
      house: 12,
      neighborhood: 'Centro',
      city: 'Belo Horizonte',
    },
  };

  // =========================================
  // OBJETO DO FORMULÁRIO
  // =========================================
  public pessoa: Monitorado = {
    responsavelId: this.responsavelId,
    name: '',
    cpf: '',
    phone: '',
    email: '',
    address: {
      street: '',
      house: null,
      neighborhood: '',
      city: '',
    },
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private safeHomeApi: SafeHomeApi,
    private modalCtrl: ModalController
  ) {}

  // =========================================
  // INICIALIZAÇÃO
  // =========================================
  ngOnInit() {
    this.safeHomeApi.getMonitorados(this.responsavelId);
    this.safeHomeApi.getIncidentesDoResponsavel(this.responsavelId);

    this.safeHomeApi.monitorados$.subscribe(lista => {
      this.monitorados = lista;
      this.renderizarGrafico();
    });

    this.safeHomeApi.incidentes$.subscribe(lista => {
      this.incidentes = lista;
      this.renderizarGrafico();
    });
  }

  // =========================================
  // GRÁFICO
  // =========================================
  renderizarGrafico() {
    if (!this.monitorados?.length || !this.incidentes) return;

    const canvas = this.grafico1.nativeElement;

    if (this.chart) this.chart.destroy();

    const labels = this.monitorados.map(m => m.name);

    const data = this.monitorados.map(m => {
      return this.incidentes.filter(i => i.monitored?._id === m._id).length;
    });
    console.log(">>>> data quedas", data);

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            label: 'Quedas detectadas',
            data,
            backgroundColor: this.generateColors(labels.length),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Quedas por Monitorado' }
        }
      }
    });
  }

  private generateColors(qtd: number): string[] {
    const colors: string[] = [];

    for (let i = 0; i < qtd; i++) {
      const hue = Math.floor((360 / qtd) * i);
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }

    return colors;
  }

  // =========================================
  // FORMULÁRIO
  // =========================================
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

  abrirModalAdicionar() {
    this.modoEdicao = false;
    this.monitoradoEditando = null;

    // limpa o formulário
    this.pessoa = {
      responsavelId: this.responsavelId,
      name: '',
      cpf: '',
      phone: '',
      email: '',
      address: {
        street: '',
        house: null,
        neighborhood: '',
        city: '',
      },
    };

    // document.getElementById("open-modal")?.click();
    this.modal.present();
  }

  abrirModalEdicao(m: any) {
    this.modoEdicao = true;
    this.monitoradoEditando = m;

    // clona o monitorado para evitar edição direta da lista
    this.pessoa = {
      ...m,
      address: { ...m.address }
    };

    // document.getElementById("open-modal")?.click();
    this.modal.present();
  }

  async recarregarMonitorados() {
    await this.safeHomeApi.getMonitorados(this.responsavelId);

    this.safeHomeApi.monitorados$.subscribe(lista => {
      this.monitorados = lista;
      this.renderizarGrafico();
    });
  }


  async confirm() {
    if (!this.isFormValid()) return;

    const body = { ...this.pessoa };

    try {
      if (this.modoEdicao) {
        // EDITAR
        await this.safeHomeApi.updatePerson(this.monitoradoEditando._id, body);
      } else {
        // ADICIONAR
        await this.safeHomeApi.adicionaMonitorado(body);
      }

      this.modal.dismiss();
      this.recarregarMonitorados();

    } catch (err) {
      console.error(err);
    }
  }

  // =========================================
  // AÇÕES DELETAR
  // =========================================
  async confirmarDelecao(nome: string, id?: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: `Tem certeza que deseja excluir ${nome}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => this.safeHomeApi.deletarMonitorado(id),
        },
      ],
    });

    await alert.present();
  }

  // =========================================
  // OUTROS
  // =========================================
  configuraUsuario() {
    this.navCtrl.navigateForward('/configuracao-usuario');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }

  trackById(index: number, item: Monitorado) {
    return item._id ?? index;
  }
}
