import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FlashcardFormComponent } from './pages/flashcard-form/flashcard-form.component';
import { FlashcardViewerComponent } from './pages/flashcard-viewer/flashcard-viewer.component';
import { FavoritesViewerComponent } from './pages/favorites-viewer/favorites-viewer.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'author', component: FlashcardFormComponent },
  { path: 'flashcard-viewer', component: FlashcardViewerComponent }, 
  { path: 'flashcard-viewer/:id', component: FlashcardViewerComponent },
  { path: 'favorites', component: FavoritesViewerComponent },
  { path: '**', redirectTo: 'dashboard' },
];
