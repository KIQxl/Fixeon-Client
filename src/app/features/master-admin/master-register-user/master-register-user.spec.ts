import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRegisterUser } from './master-register-user';

describe('MasterRegisterUser', () => {
  let component: MasterRegisterUser;
  let fixture: ComponentFixture<MasterRegisterUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterRegisterUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterRegisterUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
