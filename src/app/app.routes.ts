import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import('./features/components/country-list/country-list.component').then((m) => m.CountryListComponent)
  },
  {
    path: 'country/:code', loadComponent: () => import('./features/components/country-detail/country-detail.component').then((m) => m.CountryDetailComponent)
  }
];
