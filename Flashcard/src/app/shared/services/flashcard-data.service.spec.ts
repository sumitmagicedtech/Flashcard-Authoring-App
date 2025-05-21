import { TestBed } from '@angular/core/testing';

import { FlashcardDataService } from './flashcard-data.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('FlashcardDataService', () => {
  let service: FlashcardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers : [HttpClient, HttpHandler]
    });
    service = TestBed.inject(FlashcardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
