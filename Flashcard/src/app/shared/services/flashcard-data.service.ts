import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Flashcard } from '../model/flashcard.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FlashcardDataService {
  // Key used to store flashcards in localStorage
  private key = 'flashcardData';

  // Observable stream of flashcards for components to subscribe to
  private flashcardsSubject = new BehaviorSubject<Flashcard[]>([]);

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private http: HttpClient
  ) {
    // Load data only in browser (not on server)
    if (isPlatformBrowser(this.platformId)) {
      const existing = this.getFlashcards();
      this.flashcardsSubject.next(existing);
      this.loadMockFlashcards(); // Append mock data if not already present
    }
  }

  // Public observable for other components to react to flashcard changes
  get flashcards$() {
    return this.flashcardsSubject.asObservable();
  }

  // Retrieve flashcards from localStorage
  getFlashcards(): Flashcard[] {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    }
    return [];
  }

  // Add a new flashcard and update storage and observable
  addFlashcard(flashcard: Flashcard): void {
    if (isPlatformBrowser(this.platformId)) {
      const flashcards = this.getFlashcards();
      flashcards.unshift(flashcard); // Add to beginning of the list
      localStorage.setItem(this.key, JSON.stringify(flashcards));
      this.updateFlashcards(flashcards);
    }
  }

  // Update the localStorage and observable stream with new flashcard array
  updateFlashcards(flashcards: Flashcard[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.key, JSON.stringify(flashcards));
    }
    this.flashcardsSubject.next(flashcards);
  }

  // Clear all flashcards from localStorage and reset observable
  clearFlashcards(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.key);
      this.flashcardsSubject.next([]);
    }
  }

  /**
   * Load mock flashcards from the JSON file and append them
   * to existing flashcards in localStorage (without duplicates by ID).
   */
  loadMockFlashcards(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.http
        .get<Flashcard[]>('/mock-flashcards.json') // file is in /public folder
        .subscribe({
  next: (mockData) => {
    const existing = this.getFlashcards();

    const merged = [
      ...existing,
      ...mockData.filter(
        (mockCard) => !existing.some((card) => card.id === mockCard.id)
      ),
    ];

    localStorage.setItem(this.key, JSON.stringify(merged));
    this.flashcardsSubject.next(merged);
  },
  error: (error) => {
    console.error('Error loading mock flashcards:', error);
  }
});

    }
  }
}
