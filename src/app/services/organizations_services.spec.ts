import { TestBed } from '@angular/core/testing';

import { Organization_services } from './organizations_services';

describe('Organizations', () => {
  let service: Organization_services;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Organization_services);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
