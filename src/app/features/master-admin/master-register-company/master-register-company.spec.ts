import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRegisterCompany } from './master-register-company';

describe('MasterRegisterCompany', () => {
  let component: MasterRegisterCompany;
  let fixture: ComponentFixture<MasterRegisterCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterRegisterCompany]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterRegisterCompany);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
