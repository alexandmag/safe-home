import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,
})
export class WelcomePage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  telaHome() {
    this.navCtrl.navigateForward('/home');
  }
}
