import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    // Aqui você pegaria os valores do formulário
    const email = 'usuario@exemplo.com';
    const password = '123456';
    
    if (this.authService.login(email, password)) {
      this.router.navigate(['/home']);
    }
  }
}