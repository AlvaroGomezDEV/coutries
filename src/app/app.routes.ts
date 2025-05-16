import { Routes } from '@angular/router';
import { CountryDetailComponent } from './features/components/country-detail/country-detail.component';
import { CountryListComponent } from './features/components/country-list/country-list.component';

export const routes: Routes = [
  {
    path: 'countries',
    component: CountryListComponent
  },
  {
    path: '', redirectTo: 'countries', pathMatch: 'full'
  },
  {
    path: 'country/:code',
    component: CountryDetailComponent
  }
];
