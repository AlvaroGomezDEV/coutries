import { Injectable, signal, computed } from '@angular/core';
import { Country } from '../models/country.model';

@Injectable({ providedIn: 'root' })
export class FavoritesStore {

  private readonly _favorites = signal<Country[]>([]);

  readonly favorites = this._favorites.asReadonly();

  readonly favoritesCount = computed(() => this._favorites().length);

  readonly isFavorite = (code: string) => computed(() => this._favorites().some(c => c.cca3 === code));

  addFavorite(country: Country): void {
    if (!this.isFavorite(country.cca3)()) {
      const updated = [...this._favorites(), country];
      this._favorites.set(updated);
    }
  }

  removeFavorite(code: string): void {
    const updated = this._favorites().filter(c => c.cca3 !== code);
    this._favorites.set(updated);
  }

  toggleFavorite(country: Country): void {
    const exists = this._favorites().some(c => c.cca3 === country.cca3);
    const updated = exists
      ? this._favorites().filter(c => c.cca3 !== country.cca3)
      : [...this._favorites(), country];
    this._favorites.set(updated);
  }
}