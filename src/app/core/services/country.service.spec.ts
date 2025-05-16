import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CountryService } from './country.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountryService]
    });

    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should get all the countries paged', () => {
    const mockCountries = [
      { cca3: 'ESP', name: { common: 'España' } },
      { cca3: 'FRA', name: { common: 'Francia' } },
      { cca3: 'ITA', name: { common: 'Italia' } }
    ];

    service.getAllCountries(1, 2).subscribe(countries => {
      expect(countries.length).toBe(2);
      expect(countries[0].cca3).toBe('ESP');
      expect(countries[1].cca3).toBe('FRA');
    });

    const req = httpMock.expectOne('https://restcountries.com/v3.1/all');
    expect(req.request.method).toBe('GET');
    req.flush(mockCountries);
  });

  it('should get a country by code', () => {
    const mockCountry = { cca3: 'ESP', name: { common: 'España' } };

    service.getCountryByCode('ESP').subscribe(country => {
      expect(country.cca3).toBe('ESP');
    });

    const req = httpMock.expectOne('https://restcountries.com/v3.1/alpha/ESP');
    expect(req.request.method).toBe('GET');
    req.flush([mockCountry]);
  });

  it('should return paginated countries from cache if they are already loaded', () => {
    service['allCountries'] = [
      {
        name: {
          common: 'Test Country 1',
          official: 'Official Test Country 1'
        },
        cca2: 'TC',
        cca3: 'TST',
        capital: ['Test Capital 1'],
        population: 1000000,
        region: 'Test Region 1',
        subregion: 'Test Subregion 1',
        languages: { eng: 'English' },
        currencies: { USD: { name: 'US Dollar', symbol: '$' } },
        area: 1000,
        borders: ['BOR1', 'BOR2'],
        flags: {
          png: 'test1.png',
          svg: 'test1.svg',
          alt: 'Test flag 1'
        }
      },
      {
        name: {
          common: 'Test Country 2',
          official: 'Official Test Country 2'
        },
        cca2: 'TS',
        cca3: 'TCT',
        capital: ['Test Capital 2'],
        population: 1100000,
        region: 'Test Region 2',
        subregion: 'Test Subregion 2',
        languages: { eng: 'English' },
        currencies: { USD: { name: 'US Dollar', symbol: '$' } },
        area: 1000,
        borders: ['BOR1', 'BOR2'],
        flags: {
          png: 'test2.png',
          svg: 'test2.svg',
          alt: 'Test flag 2'
        }
      },
      {
        name: {
          common: 'Test Country 3',
          official: 'Official Test Country 3'
        },
        cca2: 'TT',
        cca3: 'TTT',
        capital: ['Test Capital 3'],
        population: 1100000,
        region: 'Test Region 3',
        subregion: 'Test Subregion 3',
        languages: { eng: 'English' },
        currencies: { USD: { name: 'US Dollar', symbol: '$' } },
        area: 1000,
        borders: ['BOR1', 'BOR2'],
        flags: {
          png: 'test3.png',
          svg: 'test3.svg',
          alt: 'Test flag 3'
        }
      }
    ];

    service.getAllCountries(1, 2).subscribe(countries => {
      expect(countries.length).toBe(2);
      expect(countries[0].cca3).toBe('TST');
      expect(countries[1].cca3).toBe('TCT');
    });

    httpMock.expectNone('https://restcountries.com/v3.1/all');
  });

  it('should handle errors when getting a country by code', () => {
    const consoleErrorSpy = spyOn(console, 'error');

    service.getCountryByCode('XYZ').subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(HttpErrorResponse);
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne('https://restcountries.com/v3.1/alpha/XYZ');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching country: ',
      jasmine.any(HttpErrorResponse)
    );
  });

  afterEach(() => {
    httpMock.verify();
  });
});
