import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesViewerComponent } from './favorites-viewer.component';

describe('FavoritesViewerComponent', () => {
  let component: FavoritesViewerComponent;
  let fixture: ComponentFixture<FavoritesViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
