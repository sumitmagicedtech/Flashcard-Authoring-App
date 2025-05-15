import { TestBed } from '@angular/core/testing';

import { PracticeModeService } from './practice-mode.service';

describe('PracticeModeService', () => {
  let service: PracticeModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PracticeModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
