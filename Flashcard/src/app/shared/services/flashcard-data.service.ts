import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Flashcard } from '../model/flashcard.model';

@Injectable({
  providedIn: 'root',
})
export class FlashcardDataService {
  private key = 'flashcardData';
  private flashcardsSubject = new BehaviorSubject<Flashcard[]>([]); // Initially empty array

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.flashcardsSubject.next(this.getFlashcards());
    }
  }

  // Observable to get the current list of flashcards
  get flashcards$() {
    return this.flashcardsSubject.asObservable();
  }

  // Get flashcards from localStorage
  getFlashcards(): Flashcard[] {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    }
    return []; // Return an empty array if not in the browser
  }

  // Add a new flashcard
  addFlashcard(flashcard: Flashcard): void {
    if (isPlatformBrowser(this.platformId)) {
      const flashcards = this.getFlashcards();
      flashcards.unshift(flashcard); // Add the new flashcard at the beginning
      localStorage.setItem(this.key, JSON.stringify(flashcards));
      this.updateFlashcards(flashcards); // Emit updated flashcards
    }
  }

  // Method to update flashcards in localStorage and notify subscribers
  updateFlashcards(flashcards: Flashcard[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.key, JSON.stringify(flashcards)); // Save updated flashcards to localStorage
    }
    this.flashcardsSubject.next(flashcards); // Notify subscribers with the updated list
  }

  // Clear all flashcards from localStorage
  clearFlashcards(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.key); // Remove from localStorage
      this.flashcardsSubject.next([]); // Notify subscribers with empty list
    }
  }
}
