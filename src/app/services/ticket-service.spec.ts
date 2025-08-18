import { TestBed } from '@angular/core/testing';
import { Tickets_Services } from './ticket-service';


describe('Tickets', () => {
  let service: Tickets_Services;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tickets_Services);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
