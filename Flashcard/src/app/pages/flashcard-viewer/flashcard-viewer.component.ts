import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { flipAnimation, starAnimation } from '../../shared/animations/flip.animation';
import { Flashcard } from '../../shared/services/flashcard.service';
import { FlashcardTrackingService } from '../../shared/services/flashcard-tracking.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlashcardDataService } from '../../shared/services/flashcard-data.service';

@Component({
  selector: 'app-flashcard-viewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './flashcard-viewer.component.html',
  styleUrl: './flashcard-viewer.component.scss',
  animations: [flipAnimation, starAnimation]
})
export class FlashcardViewerComponent implements OnInit {
  flashcard: Flashcard | null = null;
  flashcards: Flashcard[] = [];
  isFlipped = false;
  isBrowser: boolean;
  currentIndex = 0;
  favoriteIds = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private trackingService: FlashcardTrackingService,
    private flashcardDataService: FlashcardDataService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ngOnInit(): void {
  //   const idParam = this.route.snapshot.paramMap.get('id');

  //   this.flashcardDataService.flashcards$.subscribe((cards) => {
  //     this.flashcards = cards;

  //     if (idParam) {
  //       const id = Number(idParam);
  //       const index = cards.findIndex((c) => c.id === id);
  //       if (index !== -1) {
  //         this.currentIndex = index;
  //         this.setFlashcard();
  //       }
  //     } else if (cards.length > 0) {
  //       this.currentIndex = 0;
  //       this.setFlashcard();
  //     }
  //   });

  //   if (this.isBrowser) {
  //     const stored = localStorage.getItem('favorites');
  //     if (stored) {
  //       this.favoriteIds = new Set(JSON.parse(stored));
  //     }
  //   }
  // }

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


  setFlashcard(): void {
    this.flashcard = this.flashcards[this.currentIndex];
    this.trackingService.markAsViewed(this.flashcard.id);
    this.isFlipped = false;
  }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
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
  this.currentIndex = (this.currentIndex - 1 + this.flashcards.length) % this.flashcards.length;
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
