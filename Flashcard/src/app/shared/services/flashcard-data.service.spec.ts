import { TestBed } from '@angular/core/testing';

import { FlashcardDataService } from './flashcard-data.service';

describe('FlashcardDataService', () => {
  let service: FlashcardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlashcardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
