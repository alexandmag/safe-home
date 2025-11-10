import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

    constructor() {
        // Verifica se o usuário já está logado ao iniciar o app
        this.checkAuthStatus();
    }

    private checkAuthStatus(): void {
        // Verifica se existe um token ou flag de autenticação no localStorage
        const token = localStorage.getItem('authToken');
        this.isAuthenticatedSubject.next(!!token);
    }

    isLoggedIn(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    login(email: string, password: string): boolean {
        // Aqui você implementará a lógica real de autenticação
        // Por enquanto, apenas simula um login bem-sucedido
        localStorage.setItem('authToken', 'fake-token-123');
        this.isAuthenticatedSubject.next(true);
        return true;
    }

    register(email: string, password: string): boolean {
        // Aqui você implementará a lógica real de cadastro
        // Por enquanto, apenas simula um cadastro bem-sucedido
        localStorage.setItem('authToken', 'fake-token-123');
        this.isAuthenticatedSubject.next(true);
        return true;
    }

    logout(): void {
        localStorage.removeItem('authToken');
        this.isAuthenticatedSubject.next(false);
    }
}