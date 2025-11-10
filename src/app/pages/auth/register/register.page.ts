import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    // Aqui você pegaria os valores do formulário
    const email = 'usuario@exemplo.com';
    const password = '123456';
    
    if (this.authService.register(email, password)) {
      this.router.navigate(['/home']);
    }
  }
}