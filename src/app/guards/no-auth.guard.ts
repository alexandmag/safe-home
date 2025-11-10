import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(): boolean {
        if (!this.authService.isLoggedIn()) {
            return true;
        } else {
            // Se já está logado, redireciona para home
            this.router.navigate(['/home']);
            return false;
        }
    }
}