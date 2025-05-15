import { Injectable, signal, computed } from '@angular/core';
import { Country } from '../models/country.model';

@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  
  private readonly _favorites = signal<Country[]>([]);

  readonly favorites = this._favorites.asReadonly();

  readonly favoritesCount = computed(() => this._favorites().length);

  readonly isFavorite = (code: string) => computed(() => this._favorites().some(c => c.cca3 === code));

  addFavorite(country: Country): void {
    this._favorites.update(current => {
      if (!current.some(c => c.cca3 === country.cca3)) {
        return [...current, country];
      }

      return current;
    });
  }

  removeFavorite(code: string): void {
    this._favorites.update(current =>  current.filter(c => c.cca3 !== code));
  }

  toggleFavorite(country: Country): void {
    if (this.isFavorite(country.cca3)()) {
      this.removeFavorite(country.cca3);
    } else {
      this.addFavorite(country);
    }
  }
}