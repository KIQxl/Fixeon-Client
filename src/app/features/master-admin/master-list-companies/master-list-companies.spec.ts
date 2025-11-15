import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterListCompanies } from './master-list-companies';

describe('MasterListCompanies', () => {
  let component: MasterListCompanies;
  let fixture: ComponentFixture<MasterListCompanies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterListCompanies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterListCompanies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
