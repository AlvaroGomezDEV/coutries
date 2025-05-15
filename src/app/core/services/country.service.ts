import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Country } from '../models/country.model'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://restcountries.com/v3.1';

  getAllCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/all`)
  }
}
