import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CountryService } from '../../../core/services/country.service';
import { Country } from '../../../core/models/country.model';
import { catchError, of, switchMap } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-country-detail',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryDetailComponent implements OnInit {

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private countryService = inject(CountryService);

  protected country = signal<Country | null>(null);

  protected isLoading = signal(true);

  protected error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const code = params.get('code');

        if(!code) {
          this.router.navigate(['/']);
          return of(null)
        }

        return this.countryService.getCountryByCode(code).pipe(
          catchError(() => {
            console.log("Error al obtener el pais")
            return of(null)
          })
        )
      })
    ).subscribe({
      next: (country) => {
        if(country) {
          this.country.set(country)
        }

        this.isLoading.set(false)
      }
    })
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
}
