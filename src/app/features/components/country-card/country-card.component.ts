import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Country } from '../../../core/models/country.model';
import { DecimalPipe } from '@angular/common';
import { FavoritesStore } from '../../../core/store/favorites.store';

@Component({
  selector: 'app-country-card',
  imports: [DecimalPipe],
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.scss',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryCardComponent {

  private readonly favoritesStore = inject(FavoritesStore)

  public country = input.required<Country>();
  
  protected isFavorite = computed(() => 
    this.favoritesStore.isFavorite(this.country()?.cca3 || '')()
  );
}
