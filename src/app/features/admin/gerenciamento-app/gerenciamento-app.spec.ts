import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciamentoApp } from './gerenciamento-app';

describe('GerenciamentoApp', () => {
  let component: GerenciamentoApp;
  let fixture: ComponentFixture<GerenciamentoApp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciamentoApp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciamentoApp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
