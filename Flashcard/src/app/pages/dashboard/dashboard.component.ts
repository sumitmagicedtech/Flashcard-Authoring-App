import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FlashcardDataService } from '../../shared/services/flashcard-data.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  flashcards: any[] = [];
  filteredFlashcards: any[] = [];
  displayedColumns: string[] = [
    'srNo',
    'title',
    'category',
    'subCategory',
    'subject',
    'difficulty',
    'action',
  ];

  filters = {
    category: '',
    subCategory: '',
    subject: '',
    difficulty: '',
  };

  categories: string[] = [];
  subCategories: string[] = [];
  subjects: string[] = [];
  difficulties: string[] = [];

  // MatPaginator reference
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>(); // MatTableDataSource for pagination

  pageSize: number = 5; // Set default page size to 5
  isBrowser: boolean;

  constructor(
    private flashcardService: FlashcardDataService, // <-- Use FlashcardDataService here
    private route: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.flashcardService.flashcards$.subscribe((flashcards) => {
      this.flashcards = flashcards;
      this.filteredFlashcards = [...this.flashcards];
      this.dataSource.data = this.filteredFlashcards.slice(0, this.pageSize);
      this.loadFilterOptions();
    });
  }

  loadFilterOptions() {
    const categoriesSet = new Set<string>();
    const subCategoriesSet = new Set<string>();
    const subjectsSet = new Set<string>();
    const difficultiesSet = new Set<string>();

    this.flashcards.forEach((card) => {
      categoriesSet.add(card.tags.category);
      subCategoriesSet.add(card.tags.subCategory);
      subjectsSet.add(card.tags.subject);
      difficultiesSet.add(card.difficulty);
    });

    this.categories = Array.from(categoriesSet);
    this.subCategories = Array.from(subCategoriesSet);
    this.subjects = Array.from(subjectsSet);
    this.difficulties = Array.from(difficultiesSet);
  }

  applyFilter() {
    this.filteredFlashcards = this.flashcards.filter((card) => {
      const categoryMatch = card.tags.category
        .toLowerCase()
        .includes(this.filters.category.toLowerCase());
      const subCategoryMatch = card.tags.subCategory
        .toLowerCase()
        .includes(this.filters.subCategory.toLowerCase());
      const subjectMatch = card.tags.subject
        .toLowerCase()
        .includes(this.filters.subject.toLowerCase());
      const difficultyMatch = card.difficulty
        .toLowerCase()
        .includes(this.filters.difficulty.toLowerCase());

      return (
        categoryMatch && subCategoryMatch && subjectMatch && difficultyMatch
      );
    });

    this.dataSource.data = this.filteredFlashcards.slice(0, this.pageSize); // Reset to first 5 after applying filters
    this.paginator.pageIndex = 0; // Reset to first page after applying filters
  }

  resetFilters() {
    this.filters = {
      category: '',
      subCategory: '',
      subject: '',
      difficulty: '',
    };
    this.filteredFlashcards = [...this.flashcards]; // Reset the filtered list
    this.dataSource.data = this.filteredFlashcards.slice(0, this.pageSize); // Reset to first 5 rows
    this.paginator.pageIndex = 0; // Reset to first page after resetting filters
  }

  viewCard(id: number): void {
    this.route.navigate([`/flashcard-viewer/${id}`]); // Navigate with the flashcard ID
  }

  onPageChange(event: any) {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;

    // Update data source to show only the items on the current page
    this.dataSource.data = this.filteredFlashcards.slice(startIndex, endIndex);
  }

  deleteCard(id: number): void {
    // Find the index of the card to delete
    const cardIndex = this.flashcards.findIndex((card) => card.id === id);

    if (cardIndex !== -1) {
      // Remove the card from the flashcards array
      this.flashcards.splice(cardIndex, 1);

      // Update localStorage to reflect the changes
      if (this.isBrowser) {
        localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
      }

      // Re-apply filters and update the table data
      this.applyFilter();

      // Notify the service to update the flashcards list
      this.flashcardService.updateFlashcards(this.flashcards); // Update the observable in the service
    }
  }
}
