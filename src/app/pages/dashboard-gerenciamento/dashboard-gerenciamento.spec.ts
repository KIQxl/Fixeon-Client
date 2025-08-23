import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGerenciamento } from './dashboard-gerenciamento';

describe('DashboardGerenciamento', () => {
  let component: DashboardGerenciamento;
  let fixture: ComponentFixture<DashboardGerenciamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardGerenciamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardGerenciamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
