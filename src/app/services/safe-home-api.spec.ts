import { TestBed } from '@angular/core/testing';

import { SafeHomeApi } from './safe-home-api';

describe('SafeHomeApi', () => {
  let service: SafeHomeApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeHomeApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
