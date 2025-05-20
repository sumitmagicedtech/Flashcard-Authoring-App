import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlashcardFormComponent } from './flashcard-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashcardDataService } from '../../shared/services/flashcard-data.service';

describe('FlashcardFormComponent', () => {
  let component: FlashcardFormComponent;
  let fixture: ComponentFixture<FlashcardFormComponent>;
  let flashcardServiceSpy: jasmine.SpyObj<FlashcardDataService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const flashcardSpy = jasmine.createSpyObj('FlashcardDataService', [
      'addFlashcard',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FlashcardFormComponent],
      providers: [
        { provide: FlashcardDataService, useValue: flashcardSpy },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FlashcardFormComponent);
    component = fixture.componentInstance;
    flashcardServiceSpy = TestBed.inject(
      FlashcardDataService
    ) as jasmine.SpyObj<FlashcardDataService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form).toBeDefined();
    expect(component.options.length).toBe(4);
  });

  it('should be invalid if required fields are empty', () => {
    component.form.reset();
    expect(component.form.valid).toBeFalse();
  });

  it('should add image correctly', () => {
    const dummyFile = new File(['dummy'], 'dummy.jpg', { type: 'image/jpeg' });
    const input = document.createElement('input');
    input.type = 'file';
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(dummyFile);
    input.files = dataTransfer.files;

    const event = { target: input } as unknown as Event;

    component.addImage(event);
    expect(component.images.length).toBe(1);
    expect(component.images.at(0).value).toBe('dummy.jpg');
  });

  it('should remove image correctly', () => {
    component.images.push(component['fb'].control('image1.png'));
    expect(component.images.length).toBe(1);
    component.removeImage(0);
    expect(component.images.length).toBe(0);
  });

  it('should submit valid form and call service and navigate', () => {
    component.form.setValue({
      title: 'Test Title',
      images: [],
      tags: {
        category: 'Science',
        subCategory: 'Physics',
        subject: 'Light',
      },
      difficulty: 'Easy',
      animation: 'Flip',
      question: 'What is light?',
      answer: 'A form of energy',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 1,
    });

    component.submit();

    expect(flashcardServiceSpy.addFlashcard).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not submit when form is invalid', () => {
    component.form.patchValue({
      title: '',
      question: '',
      answer: '',
    });

    component.submit();

    expect(flashcardServiceSpy.addFlashcard).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should clear the form properly', () => {
    component.images.push(component['fb'].control('img.png'));
    component.options.at(0).setValue('Test');
    component.correctAnswerControl.setValue(2);

    component.clearForm();

    expect(component.form.pristine).toBeTrue();
    expect(component.images.length).toBe(0);
    expect(component.correctAnswerControl.value).toBeNull();
  });
});
