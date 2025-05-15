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

  constructor(
    private route: ActivatedRoute,
    private flashcardDataService: FlashcardDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.flashcardDataService.flashcards$.subscribe((cards) => {
      const found = cards.find((c) => c.id === id);
      if (found) {
        this.flashcard = found;
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