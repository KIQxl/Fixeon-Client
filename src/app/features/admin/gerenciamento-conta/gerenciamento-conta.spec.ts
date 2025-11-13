import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciamentoConta } from './gerenciamento-conta';

describe('GerenciamentoConta', () => {
  let component: GerenciamentoConta;
  let fixture: ComponentFixture<GerenciamentoConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciamentoConta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciamentoConta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
