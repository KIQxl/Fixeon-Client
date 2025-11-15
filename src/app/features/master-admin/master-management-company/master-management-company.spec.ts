import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterManagementCompany } from './master-management-company';

describe('MasterManagementCompany', () => {
  let component: MasterManagementCompany;
  let fixture: ComponentFixture<MasterManagementCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterManagementCompany]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterManagementCompany);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
