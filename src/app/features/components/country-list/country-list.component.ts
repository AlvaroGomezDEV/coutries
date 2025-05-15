import { Component, inject, OnInit, signal } from '@angular/core';

import { CountryService } from '../../../core/services/country.service'
import { Country } from '../../../core/models/country.model';
import { JsonPipe } from '@angular/common';
import { CountryCardComponent } from '../country-card/country-card.component';

@Component({
  selector: 'app-country-list',
  imports: [CountryCardComponent, JsonPipe],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.scss',
  providers: [CountryService]
})
export class CountryListComponent implements OnInit {

  private readonly countryService = inject(CountryService);

  protected countries = signal<Country[]>([]);

  protected isLoading = signal(false);

  ngOnInit(): void {
    this.getAllCountries();
  }

  getAllCountries() {
    console.log("fetching")
    this.isLoading.set(true);
    
    this.countryService.getAllCountries().subscribe({
      next: (countries) => {
        this.countries.set(countries)
        this.isLoading.set(false);
        console.log("fetched")
      }, error: () => console.log("error fetching")
    })
  }
}
