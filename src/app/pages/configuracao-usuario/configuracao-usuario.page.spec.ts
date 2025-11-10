import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguracaoUsuarioPage } from './configuracao-usuario.page';

describe('ConfiguracaoUsuarioPage', () => {
  let component: ConfiguracaoUsuarioPage;
  let fixture: ComponentFixture<ConfiguracaoUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracaoUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
