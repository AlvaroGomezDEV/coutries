import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryDetailComponent } from './country-detail.component';
import { Router } from '@angular/router';
import { CountryService } from '../../../core/services/country.service';
import { FavoritesStore } from '../../../core/store/favorites.store';
import { of, throwError } from 'rxjs';
import { Country } from '../../../core/models/country.model';
import { FormatNumberPipe } from '../../../core/pipes/format-number.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { signal } from '@angular/core';

describe('CountryDetailComponent', () => {
  let component: CountryDetailComponent;
  let fixture: ComponentFixture<CountryDetailComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockCountryService: jasmine.SpyObj<CountryService>;
  let mockFavoritesStore: jasmine.SpyObj<FavoritesStore>;
  // let mockActivatedRoute: any;

  const mockCountry: Country = {
    name: {
      common: 'Test Country',
      official: 'Official Test Country'
    },
    cca2: 'TC',
    cca3: 'TST',
    capital: ['Test Capital'],
    population: 1000000,
    region: 'Test Region',
    subregion: 'Test Subregion',
    languages: { eng: 'English' },
    currencies: { USD: { name: 'US Dollar', symbol: '$' } },
    area: 1000,
    borders: ['BOR1', 'BOR2'],
    flags: {
      png: 'test.png',
      svg: 'test.svg',
      alt: 'Test flag'
    }
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockCountryService = jasmine.createSpyObj('CountryService', ['getCountryByCode']);
    mockFavoritesStore = jasmine.createSpyObj('FavoritesStore', [
      'isFavorite',
      'toggleFavorite'
    ]);
    
    // mockActivatedRoute = {
    //   paramMap: of({
    //     get: (key: string) => 'TST'
    //   })
    // };

    await TestBed.configureTestingModule({
      imports: [MatIcon, MatButtonModule, FormatNumberPipe],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: CountryService, useValue: mockCountryService },
        { provide: FavoritesStore, useValue: mockFavoritesStore },
        // { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CountryDetailComponent);
    component = fixture.componentInstance;
    
    mockFavoritesStore.isFavorite.and.returnValue(signal(false));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load country data', () => {
    mockCountryService.getCountryByCode.and.returnValue(of(mockCountry));
    
    fixture.componentRef.setInput('code', 'TST');
    component.ngOnInit();
    
    expect(mockCountryService.getCountryByCode).toHaveBeenCalledWith('TST');
    expect(component['country']()).toEqual(mockCountry);
    expect(component['isLoading']()).toBeFalse();
  });

  it('should handle error when loading country', () => {
    mockCountryService.getCountryByCode.and.returnValue(throwError(() => new Error('Test Error')));
    
    fixture.componentRef.setInput('code', 'TST');
    component.ngOnInit();
    
    expect(component['error']()).toBe('Error getting country');
    expect(component['isLoading']()).toBeFalse();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should toggle favorite status', () => {
    component['country'].set(mockCountry);
    component.toggleFavorite();
    
    expect(mockFavoritesStore.toggleFavorite).toHaveBeenCalledWith(mockCountry);
  });

  it('should get languages correctly', () => {
    const result = component.getLanguages(mockCountry.languages);
    expect(result).toBe('English');
  });

  it('should return N/A when no languages', () => {
    const result = component.getLanguages(undefined);
    expect(result).toBe('N/A');
  });

  it('should get currencies correctly', () => {
    const result = component.getCurrencies(mockCountry.currencies);
    expect(result).toBe('US Dollar');
  });

  it('should return N/A when no currencies', () => {
    const result = component.getCurrencies(undefined);
    expect(result).toBe('N/A');
  });

  it('should get currency symbols correctly', () => {
    const result = component.getCurrencySymbol(mockCountry.currencies);
    expect(result).toBe('$');
  });

  it('should return N/A when no currency symbols', () => {
    const result = component.getCurrencySymbol(undefined);
    expect(result).toBe('N/A');
  });

  it('should compute isFavorite correctly', () => {
    mockFavoritesStore.isFavorite.and.returnValue(signal(true));
    component['country'].set(mockCountry);
    
    expect(component['isFavorite']()).toBeTrue();
  });

  it('should handle isFavorite when country is null', () => {
    component['country'].set(null);

    mockFavoritesStore.isFavorite.and.returnValue(signal(false));

    expect(component['isFavorite']()).toBeFalse();
    expect(mockFavoritesStore.isFavorite).toHaveBeenCalledWith('');
  });
});