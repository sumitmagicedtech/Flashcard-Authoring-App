import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { FlashcardDataService } from '../../shared/services/flashcard-data.service';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockFlashcardService: jasmine.SpyObj<FlashcardDataService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const dummyFlashcards = [
    {
      id: 1,
      title: 'Card 1',
      tags: {
        category: 'Math',
        subCategory: 'Algebra',
        subject: 'Equations',
      },
      difficulty: 'Easy',
    },
    {
      id: 2,
      title: 'Card 2',
      tags: {
        category: 'Science',
        subCategory: 'Biology',
        subject: 'Cells',
      },
      difficulty: 'Medium',
    },
  ];

  beforeEach(async () => {
    mockFlashcardService = jasmine.createSpyObj(
      'FlashcardDataService',
      ['updateFlashcards'],
      {
        get flashcards$() {
          return of(dummyFlashcards);
        },
      }
    );
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: FlashcardDataService, useValue: mockFlashcardService },
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the viewer with correct ID', () => {
    component.viewCard(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/flashcard-viewer/1']);
  });

  it('should delete a card and update the service', () => {
    spyOn(localStorage, 'setItem');
    component.deleteCard(1);
    expect(component.flashcards.length).toBe(1);
    expect(mockFlashcardService.updateFlashcards).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should update dataSource.data correctly on page change', () => {
    // Setup filteredFlashcards with 10 dummy items
    component.filteredFlashcards = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Card ${i + 1}`,
      tags: {
        category: 'Category',
        subCategory: 'SubCategory',
        subject: 'Subject',
      },
      difficulty: 'Easy',
    }));

    // Set initial dataSource data (simulate initial page 0, size 5)
    component.dataSource.data = component.filteredFlashcards.slice(0, 5);

    // Simulate page event to page 1 (second page), pageSize 5
    const pageEvent = { pageIndex: 1, pageSize: 5 };

    component.onPageChange(pageEvent);

    // Expect dataSource.data to have items from index 5 to 9 (5 items)
    expect(component.dataSource.data.length).toBe(5);
    expect(component.dataSource.data[0].id).toBe(6);
    expect(component.dataSource.data[4].id).toBe(10);
  });
});
