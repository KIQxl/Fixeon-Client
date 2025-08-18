import { TestBed } from '@angular/core/testing';

import { Auth_Services } from './auth-services';

describe('Auth', () => {
  let service: Auth_Services;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth_Services);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
