import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlashcardTrackingService {

constructor() { }
 private viewedFlashcards: Set<number> = new Set();
 private storageKey = 'favoriteFlashcards';



  getFavorites(): number[] {
    const favorites = localStorage.getItem(this.storageKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite(id: number): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }
  }

  removeFavorite(id: number): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter(favId => favId !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  isFavorite(id: number): boolean {
    return this.getFavorites().includes(id);
  }


  markAsViewed(id: number): void {
    this.viewedFlashcards.add(id);
  }

  hasViewed(id: number): boolean {
    return this.viewedFlashcards.has(id);
  }
}