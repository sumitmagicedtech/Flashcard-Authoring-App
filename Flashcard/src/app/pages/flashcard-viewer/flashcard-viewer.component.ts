import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { flipAnimation, starAnimation } from '../../shared/animations/flip.animation';
import { Flashcard, FlashcardService } from '../../shared/services/flashcard.service';
import { FlashcardTrackingService } from '../../shared/services/flashcard-tracking.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlashcardDataService } from '../../shared/services/flashcard-data.service';

@Component({
  selector: 'app-flashcard-viewer',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './flashcard-viewer.component.html',
  styleUrl: './flashcard-viewer.component.scss',
  animations: [flipAnimation, starAnimation]
})


export class FlashcardViewerComponent implements OnInit {
  flashcard: Flashcard | null = null;
  isFlipped = false;
  isBrowser: boolean;
  favoriteIds = new Set<number>();
  currentIndex = 0;
  flashcards: any;

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
    if (idParam) {
      const id = Number(idParam);
      const index = cards.findIndex((c) => c.id === id);
      if (index !== -1) {
        this.currentIndex = index;
        this.flashcard = cards[index];
        this.trackingService.markAsViewed(this.flashcard.id);
      }
    } else if (cards.length > 0) {
      // No ID provided: default to first card
      this.currentIndex = 0;
      this.flashcard = cards[0];
      this.trackingService.markAsViewed(this.flashcard.id);
    }
  });

  if (this.isBrowser) {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      this.favoriteIds = new Set(JSON.parse(stored));
    }
  }
}






  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  toggleFavorite(event: Event): void {
    if (!this.flashcard || !this.isBrowser) return;

    event.stopPropagation();
    const currentId = this.flashcard.id;

    if (this.favoriteIds.has(currentId)) {
      this.favoriteIds.delete(currentId);
    } else {
      this.favoriteIds.add(currentId);
    }

    localStorage.setItem('favorites', JSON.stringify([...this.favoriteIds]));
  }

  isFavorite(id: number): boolean {
    return this.favoriteIds.has(id);
  }






}