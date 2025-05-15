import { Component, inject, OnInit, signal } from '@angular/core';

import { CountryService } from '../../../core/services/country.service'
import { Country } from '../../../core/models/country.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-country-list',
  imports: [JsonPipe],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.scss',
  providers: [CountryService]
})
export class CountryListComponent implements OnInit {

  private readonly countryService = inject(CountryService);

  protected countries = signal<Country[]>([])

  ngOnInit(): void {
    this.getAllCountries();
  }

  getAllCountries() {
    this.countryService.getAllCountries().subscribe(countries => {
      this.countries.set(countries)
    })
  }
}
