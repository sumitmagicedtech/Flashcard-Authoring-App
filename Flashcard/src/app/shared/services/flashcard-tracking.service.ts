import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class FlashcardTrackingService {
  private viewedFlashcards: Set<number> = new Set();
  private storageKey = 'favoriteFlashcards';

  private isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getFavorites(): number[] {
    if (!this.isBrowser) return [];
    const favorites = localStorage.getItem(this.storageKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite(id: number): void {
    if (!this.isBrowser) return;
    const favorites = this.getFavorites();
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }
  }

  removeFavorite(id: number): void {
    if (!this.isBrowser) return;
    let favorites = this.getFavorites();
    favorites = favorites.filter((favId) => favId !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  isFavorite(id: number): boolean {
    if (!this.isBrowser) return false;
    return this.getFavorites().includes(id);
  }

  markAsViewed(id: number): void {
    this.viewedFlashcards.add(id);
  }

  hasViewed(id: number): boolean {
    return this.viewedFlashcards.has(id);
  }
}
