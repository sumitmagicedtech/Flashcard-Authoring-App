import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardViewerComponent } from './flashcard-viewer.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

const mockActivatedRoute = {
  params: of({ id: 1 }), // customize as needed
  queryParams: of({}),
  snapshot: {
    paramMap: {
      get: (key: string) => '1',
    },
  },
};
describe('FlashcardViewerComponent', () => {
  let component: FlashcardViewerComponent;
  let fixture: ComponentFixture<FlashcardViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardViewerComponent],
      providers : [{ provide: ActivatedRoute, useValue: mockActivatedRoute },]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashcardViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
