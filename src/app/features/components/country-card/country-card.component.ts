import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { Country } from '../../../core/models/country.model';
import { FavoritesStore } from '../../../core/store/favorites.store';
import { FormatNumberPipe } from '../../../core/pipes/format-number.pipe';

@Component({
  selector: 'app-country-card',
  imports: [FormatNumberPipe, MatIconModule],
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryCardComponent {

  private readonly favoritesStore = inject(FavoritesStore)

  public country = input.required<Country>();
  
  protected isFavorite = computed(() => 
    this.favoritesStore.isFavorite(this.country()?.cca3 || '')()
  );
}
