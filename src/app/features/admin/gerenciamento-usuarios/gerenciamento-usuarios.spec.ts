import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciamentoUsuarios } from './gerenciamento-usuarios';

describe('GerenciamentoUsuarios', () => {
  let component: GerenciamentoUsuarios;
  let fixture: ComponentFixture<GerenciamentoUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciamentoUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciamentoUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
