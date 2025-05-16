import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { catchError, of, switchMap } from 'rxjs';

import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CountryService } from '../../../core/services/country.service';
import { Country } from '../../../core/models/country.model';
import { FavoritesStore } from '../../../core/store/favorites.store';
import { FormatNumberPipe } from '../../../core/pipes/format-number.pipe';

@Component({
  selector: 'app-country-detail',
  imports: [RouterLink, FormatNumberPipe, MatIcon, MatButtonModule],
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryDetailComponent implements OnInit {

  private readonly router = inject(Router);
  
  private readonly countryService = inject(CountryService);
  
  protected code = input.required<string>();

  protected readonly favoritesStore = inject(FavoritesStore);

  protected country = signal<Country | null>(null);

  protected isLoading = signal(true);

  protected error = signal<string | null>(null);

  protected isFavorite = computed(() => 
    this.favoritesStore.isFavorite(this.country()?.cca3 || '')()
  );

  ngOnInit(): void {
    if(!this.code()) {
      this.router.navigate(['/']);
      return;
    }

    this.countryService.getCountryByCode(this.code()).pipe(
      catchError((err) => {
        console.log("Error getting country: ", err)
        this.error.set('Error getting country');
        this.isLoading.set(false);
        return of(null)
      })
    ).subscribe({
      next: (country) => {
        if(country) {
          this.country.set(country)
        }

        this.isLoading.set(false)
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/'])
  }

  getLanguages(languages: Record<string, string> | undefined): string {
    return languages ? Object.values(languages).join(', ') : 'N/A';
  }
  
  getCurrencies(currencies: Record<string, { name: string }> | undefined): string {
    if (!currencies) return 'N/A';
    return Object.values(currencies).map(c => c.name).join(', ');
  }

  getCurrencySymbol(currencies: Record<string, { symbol: string }> | undefined): string {
    if (!currencies) return 'N/A';
    return Object.values(currencies).map(c => c.symbol).join(', ');
  }

  toggleFavorite() {
    if (this.country()) {
      this.favoritesStore.toggleFavorite(this.country()!);
    }
  }
}
