import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flashcard } from '../../shared/services/flashcard.service';
import { FlashcardDataService } from '../../shared/services/flashcard-data.service';
import { FlashcardTrackingService } from '../../shared/services/flashcard-tracking.service';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-favorites-viewer',
  imports: [
    CommonModule,
     MatIconModule,
      ReactiveFormsModule,
          CommonModule,
    MatCardModule,
    MatButtonModule
    ],
  templateUrl: './favorites-viewer.component.html',
  styleUrl: './favorites-viewer.component.scss'
})
export class FavoritesViewerComponent {
allFlashcards: Flashcard[] = [];
  favoriteFlashcards: Flashcard[] = [];

  private flashcardService = inject(FlashcardDataService);
  private trackingService = inject(FlashcardTrackingService);

  ngOnInit(): void {
    this.flashcardService.flashcards$.subscribe(cards => {
      this.allFlashcards = cards;
      const favoriteIds = this.trackingService.getFavorites();
      this.favoriteFlashcards = cards.filter(card => favoriteIds.includes(card.id));
    });
  }

  removeFavorite(id: number): void {
    this.trackingService.removeFavorite(id);
    this.favoriteFlashcards = this.favoriteFlashcards.filter(f => f.id !== id);
  }
}
