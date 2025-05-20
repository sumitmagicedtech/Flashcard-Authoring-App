import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FlashcardTrackingService {
  // In-memory set to track viewed flashcards (not persisted)
  private viewedFlashcards: Set<number> = new Set();

  // Key used for storing favorite flashcard IDs in localStorage
  private storageKey = 'favoriteFlashcards';

  // Flag to check if code is running in the browser
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Retrieves favorite flashcard IDs from localStorage.
   * Returns an empty array if not running in the browser.
   */
  getFavorites(): number[] {
    if (!this.isBrowser) return [];
    const favorites = localStorage.getItem(this.storageKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  /**
   * Adds a flashcard ID to the favorites list in localStorage.
   * Avoids duplicates.
   */
  addFavorite(id: number): void {
    if (!this.isBrowser) return;
    const favorites = this.getFavorites();
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }
  }

  /**
   * Removes a flashcard ID from the favorites list in localStorage.
   */
  removeFavorite(id: number): void {
    if (!this.isBrowser) return;
    let favorites = this.getFavorites();
    favorites = favorites.filter((favId) => favId !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  /**
   * Checks if a flashcard ID is marked as favorite.
   */
  isFavorite(id: number): boolean {
    if (!this.isBrowser) return false;
    return this.getFavorites().includes(id);
  }

  /**
   * Marks a flashcard ID as viewed in memory.
   * Note: This is not persisted across sessions.
   */
  markAsViewed(id: number): void {
    this.viewedFlashcards.add(id);
  }

  /**
   * Checks if a flashcard ID has been viewed during this session.
   */
  hasViewed(id: number): boolean {
    return this.viewedFlashcards.has(id);
  }
}
