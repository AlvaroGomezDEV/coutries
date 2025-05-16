import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Country } from '../models/country.model'
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://restcountries.com/v3.1';

  private allCountries: Country[] = [];

  public totalCountries = 0;

  getAllCountries(page: number, pageSize: number): Observable<Country[]> {
    if (this.allCountries.length === 0) {
      return this.http.get<Country[]>(`${this.apiUrl}/all`).pipe(
        tap(countries => {
          this.allCountries = countries;
          this.totalCountries = countries.length;
        }),
        switchMap(() => of(this.getPaginatedCountries(page, pageSize)))
      );
    }
    return of(this.getPaginatedCountries(page, pageSize));
  }

  private getPaginatedCountries(page: number, pageSize: number): Country[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return this.allCountries.slice(start, end);
  }

  getCountryByCode(code: string): Observable<Country> {
    return this.http.get<Country[]>(`${this.apiUrl}/alpha/${code}`).pipe(
      map(response => response[0]),
      catchError(error => {
        console.error("Error fetching country: ", error);
        throw error;
      })
    );
  }
}
