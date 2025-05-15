import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardViewerComponent } from './flashcard-viewer.component';

describe('FlashcardViewerComponent', () => {
  let component: FlashcardViewerComponent;
  let fixture: ComponentFixture<FlashcardViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardViewerComponent]
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
