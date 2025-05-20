import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  flipAnimation,
  starAnimation,
} from '../../shared/animations/flip.animation';
import { FlashcardTrackingService } from '../../shared/services/flashcard-tracking.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlashcardDataService } from '../../shared/services/flashcard-data.service';
import { MatRadioModule } from '@angular/material/radio';
import { Flashcard } from '../../shared/model/flashcard.model';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-flashcard-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatButton,
  ],
  templateUrl: './flashcard-viewer.component.html',
  styleUrl: './flashcard-viewer.component.scss',
  animations: [flipAnimation, starAnimation],
})
export class FlashcardViewerComponent implements OnInit {
  flashcard: Flashcard | null = null;
  flashcards: Flashcard[] = [];
  isFlipped = false;
  isBrowser: boolean;
  currentIndex = 0;
  favoriteIds = new Set<number>();
  selectedOption = new FormControl<number | null>(null);
  cardViewed = false;
  viewedCardIds = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private trackingService: FlashcardTrackingService,
    private flashcardDataService: FlashcardDataService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    this.flashcardDataService.flashcards$.subscribe((cards) => {
      this.flashcards = cards;

      if (idParam) {
        const id = Number(idParam);
        const index = cards.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.currentIndex = index;
          this.setFlashcard();
        }
      } else if (cards.length > 0) {
        this.currentIndex = 0;
        this.setFlashcard();
      }
    });

    this.syncFavorites();
  }

  syncFavorites(): void {
    if (this.isBrowser) {
      this.favoriteIds = new Set(this.trackingService.getFavorites());
    }
  }

  // Modify setFlashcard to reset the selection each time:
  setFlashcard(): void {
    this.flashcard = this.flashcards[this.currentIndex];
    this.trackingService.markAsViewed(this.flashcard.id);
    this.isFlipped = false;
    this.selectedOption.reset(); // Reset selected option on new card
  }

  flipCard(): void {
    // Only allow flip if an option is selected or there are no options
    if (
      !this.flashcard?.options?.length ||
      this.selectedOption.value !== null
    ) {
      this.isFlipped = !this.isFlipped;
      //  this.cardViewed = true; // Mark card as viewed after flip
      if (this.flashcard) {
        this.viewedCardIds.add(this.flashcard.id);
      }
    }
  }

  hasViewedCurrentCard(): boolean {
    return this.flashcard ? this.viewedCardIds.has(this.flashcard.id) : false;
  }

  // toggleFavorite(event: Event): void {
  //   if (!this.flashcard || !this.isBrowser) return;

  //   event.stopPropagation();
  //   const currentId = this.flashcard.id;

  //   if (this.favoriteIds.has(currentId)) {
  //     this.favoriteIds.delete(currentId);
  //   } else {
  //     this.favoriteIds.add(currentId);
  //   }

  //   localStorage.setItem('favorites', JSON.stringify([...this.favoriteIds]));
  // }

  toggleFavorite(event: Event): void {
    if (!this.flashcard || !this.isBrowser) return;

    event.stopPropagation();
    const currentId = this.flashcard.id;

    if (this.trackingService.isFavorite(currentId)) {
      this.trackingService.removeFavorite(currentId);
    } else {
      this.trackingService.addFavorite(currentId);
    }

    this.syncFavorites();
  }

  isFavorite(id: number): boolean {
    return this.favoriteIds.has(id);
  }

  nextCard(): void {
    if (!this.flashcards.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.flashcards.length;
    this.setFlashcard();
  }

  prevCard(): void {
    if (!this.flashcards.length) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.flashcards.length) % this.flashcards.length;
    this.setFlashcard();
  }

  randomCard(): void {
    if (!this.flashcards.length) return;
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * this.flashcards.length);
    } while (randomIndex === this.currentIndex);
    this.currentIndex = randomIndex;
    this.setFlashcard();
  }
}
