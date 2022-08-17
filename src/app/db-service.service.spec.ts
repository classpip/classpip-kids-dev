import { TestBed } from '@angular/core/testing';

import { DbServiceService } from './Servicios/peticionesAPI';

describe('DbServiceService', () => {
  let service: DbServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
