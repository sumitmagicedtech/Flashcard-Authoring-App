import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFlashcardComponent } from './view-flashcard.component';

describe('ViewFlashcardComponent', () => {
  let component: ViewFlashcardComponent;
  let fixture: ComponentFixture<ViewFlashcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFlashcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
