import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryCardComponent } from './country-card.component';
import { FormatNumberPipe } from '../../../core/pipes/format-number.pipe';
import { Country } from '../../../core/models/country.model';
import { FavoritesStore } from '../../../core/store/favorites.store';
import { Component, signal } from '@angular/core';

describe('CountryCardComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const mockCountry: Country = {
    name: {
      common: 'Cameroon',
      official: 'Republic of Cameroon'
    },
    cca2: 'CM',
    cca3: 'CMR',
    region: 'Africa',
    flags: {
      png: 'https://flagcdn.com/w320/cm.png',
      svg: 'https://flagcdn.com/cm.svg',
      alt: 'Flag of Cameroon'
    },
    population: 26545864,
    capital: ['Yaoundé']
  };

  class MockFavoritesStore {
    isFavorite = () => () => true;
  }

  @Component({
    standalone: true,
    template: `<app-country-card [country]="country"></app-country-card>`,
    imports: [CountryCardComponent]
  })
  class HostComponent {
    country = mockCountry;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, CountryCardComponent, FormatNumberPipe],
      providers: [
        { provide: FavoritesStore, useClass: MockFavoritesStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(HostComponent).toBeTruthy();
  });

  it('should show the name, capital and population of the country', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const capitalText = fixture.nativeElement.querySelector('.text-capital')
    const populationText = fixture.nativeElement.querySelector('.text-population')

    expect(compiled.querySelector('h3')?.textContent).toContain('Cameroon');
    expect(capitalText?.textContent.trim()).toBe('Capital: Yaoundé');
    expect(populationText?.textContent.trim()).toBe("Población: 26'545.864");
  });

  it('should show the favorite icon if it is a favorite', () => {
    const icon = fixture.nativeElement.querySelector('.favorited');
    expect(icon?.textContent?.trim()).toBe('favorite');
  });

  it('should return false when country is undefined or cca3 is missing', () => {
    const mockStore = TestBed.inject(FavoritesStore) as jasmine.SpyObj<FavoritesStore>;

    spyOn(mockStore, 'isFavorite').and.returnValue(signal(false));

    const hostComponent = fixture.componentInstance;
    hostComponent.country = { ...mockCountry, cca3: undefined } as unknown as Country;

    fixture.detectChanges();

    const cardDebugElement = fixture.debugElement.children[0];
    const cardComponentInstance = cardDebugElement.componentInstance as CountryCardComponent;

    expect(cardComponentInstance['isFavorite']()).toBeFalse();
    expect(mockStore.isFavorite).toHaveBeenCalledWith('');
  });
});