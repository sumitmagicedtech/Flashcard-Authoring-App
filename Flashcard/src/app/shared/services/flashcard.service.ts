import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Flashcard {
  id: number;
  title: string;
  images: string[];
  tags: {
    category: string;
    subCategory: string;
    subject: string;
  };
  difficulty: string;
  animation: string;
  question?: string;
  answer?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FlashcardService {
private flashcardsSubject = new BehaviorSubject<any[]>([]);
  flashcards$ = this.flashcardsSubject.asObservable();
  private storageKey = 'flashcards';
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private http: HttpClient // Injecting HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Fetch flashcards from JSON file (mock data)
  getFlashcards(): Observable<any[]> {
    return this.http.get<any[]>('assets/data/mock-flashcard.json'); // ✅ Correct path
  }

    updateFlashcards(flashcards: any[]): void {
    this.flashcardsSubject.next(flashcards);
  }

  

  getFlashcardById(id: number): Observable<Flashcard | undefined> {
    const flashcards = this.getFlashcardsSync();
    return of(flashcards.find((f) => f.id === id));
  }

  addFlashcard(card: Flashcard): void {
    if (!this.isBrowser) return;
    const flashcards = this.getFlashcardsSync();
    const newId = flashcards.length
      ? Math.max(...flashcards.map((c) => c.id)) + 1
      : 1;
    card.id = newId;
    flashcards.push(card);
    localStorage.setItem(this.storageKey, JSON.stringify(flashcards));
  }

deleteFlashcard(id: number): void {
    if (!this.isBrowser) return;
    let flashcards = this.getFlashcardsSync();
    flashcards = flashcards.filter((card) => card.id !== id);
  }

  private getFlashcardsSync(): Flashcard[] {
    if (!this.isBrowser) return [];
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }
}
