import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesChamado } from './detalhes-chamado';

describe('DetalhesChamado', () => {
  let component: DetalhesChamado;
  let fixture: ComponentFixture<DetalhesChamado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesChamado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesChamado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
