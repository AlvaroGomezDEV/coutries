import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CountryListComponent } from './country-list.component';
import { of, Subject, throwError } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { CountryService } from '../../../core/services/country.service';
import { FavoritesStore } from '../../../core/store/favorites.store';
import { Country } from '../../../core/models/country.model';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

describe('CountryListComponent', () => {
  let component: CountryListComponent;
  let fixture: ComponentFixture<CountryListComponent>;
  let mockCountryService: jasmine.SpyObj<CountryService>;
  let mockFavoritesStore: jasmine.SpyObj<FavoritesStore>;
  let mockRouter: jasmine.SpyObj<Router>;
  let eventsSubject: Subject<any>;

  const mockCountries: Country[] = [
    {
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
    } as Country,
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
    } as Country
  ];

  beforeEach(async () => {
    eventsSubject = new Subject();

    mockCountryService = jasmine.createSpyObj('CountryService', ['getAllCountries']);
    mockFavoritesStore = jasmine.createSpyObj('FavoritesStore', ['toggleFavorite']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], { events: of() });

    await TestBed.configureTestingModule({
      imports: [
        CountryListComponent,
        ScrollingModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CountryService, useValue: mockCountryService },
        { provide: FavoritesStore, useValue: mockFavoritesStore },
        { provide: Router, useValue: mockRouter }
      ]
    }).overrideProvider(CountryService, { useValue: mockCountryService })
      .compileComponents();

    fixture = TestBed.createComponent(CountryListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component on ngAfterViewInit', () => {
    spyOn(component as any, 'initializeComponent');
    component.ngAfterViewInit();
    expect((component as any).initializeComponent).toHaveBeenCalled();
  });

  it('should load initial countries on init', fakeAsync(() => {
    mockCountryService.getAllCountries.and.returnValue(of(mockCountries));
    
    component.loadInitialData();
    tick();

    expect(mockCountryService.getAllCountries).toHaveBeenCalledWith(1, 20);
    expect(component.countries().length).toBe(2);
  }));

  it('should setup scroll listener in ngAfterViewChecked when not active', () => {
    component['viewport'] = {
      elementScrolled: () => of()
    } as any;
    component['scrollListenerActive'] = false;

    const setupScrollSpy = spyOn<any>(component, 'setupScrollListener');

    component.ngAfterViewChecked();

    expect(setupScrollSpy).toHaveBeenCalled();
  });

  it('should set hasMore to false when fewer items than pageSize', () => {
    component['pageSize'] = 20;
    component.countries.set(mockCountries.slice(0, 10));
    component['checkIfHasMore']();
    expect(component.hasMore).toBeFalse();
  });

  it('should load more countries when loadMore is called and hasMore is true', fakeAsync(() => {
    component['hasMore'] = true;
    component['isLoading'].set(false);
    component['currentPage'] = 2;
    component['countries'].set(mockCountries);

    const newCountries = [...mockCountries];
    mockCountryService.getAllCountries.and.returnValue(of(newCountries));

    component.loadMore();
    tick();

    expect(mockCountryService.getAllCountries).toHaveBeenCalledWith(2, 20);
    expect(component.countries().length).toBe(4);
  }));

  it('should return false if isLoading is true', () => {
    component['viewport'] = {
      getViewportSize: () => 500,
      getDataLength: () => 1000,
      measureScrollOffset: () => 400
    } as any;

    component.isLoading.set(true);
    expect((component as any).shouldLoadMore()).toBeFalse();
  });

  it('should return false if hasMore is false', () => {
    component['viewport'] = {
      getViewportSize: () => 500,
      getDataLength: () => 1000,
      measureScrollOffset: () => 400
    } as any;

    component.isLoading.set(false);
    component['hasMore'] = false;
    expect((component as any).shouldLoadMore()).toBeFalse();
  });

  it('should return true if scroll is near end (distance < 10)', () => {
    component['viewport'] = {
      getViewportSize: () => 300,
      getDataLength: () => 1000,
      measureScrollOffset: () => 691
    } as any;

    component.isLoading.set(false);
    component['hasMore'] = true;
    expect((component as any).shouldLoadMore()).toBeTrue();
  });

  it('should return false if scroll is not near end (distance ≥ 10)', () => {
    component['viewport'] = {
      getViewportSize: () => 300,
      getDataLength: () => 1000,
      measureScrollOffset: () => 690
    } as any;

    component.isLoading.set(false);
    component['hasMore'] = true;
    expect((component as any).shouldLoadMore()).toBeFalse();
  });

  it('should stop loading if getAllCountries returns empty array', fakeAsync(() => {
    component['hasMore'] = false;
    component['isLoading'].set(false);
    mockCountryService.getAllCountries.and.returnValue(of([]));

    component.loadMore();
    tick();

    expect(component.countries().length).toBe(0);
    expect(component['hasMore']).toBeFalse();
  }));

  it('should apply filters by search term', fakeAsync(() => {
    component['viewport'] = {
      scrollToIndex: () => {},
      checkViewportSize: () => {}
    } as any;

    component.searchTerm = 'test';
    component.selectedRegion = '';
    mockCountryService.getAllCountries.and.returnValue(of(mockCountries));
    const detectChangesSpy = spyOn(component['cdr'], 'detectChanges');

    component['applyFilters']();
    tick();

    expect(component.countries().length).toBeGreaterThan(0);
    expect(component['currentPage']).toBe(2);
    expect(component.isLoading()).toBeFalse();
    expect(component['searchHasResults']()).toBeTrue();
    expect(detectChangesSpy).toHaveBeenCalled();
  }));

  it('should apply filters with region and search term', fakeAsync(() => {
    component.selectedRegion = 'Test Region';
    component.searchTerm = 'Test Country';
    mockCountryService.getAllCountries.and.returnValue(of(mockCountries));

    component['applyFilters']();
    tick();

    expect(component.countries().length).toBeGreaterThan(0);
    expect(component['searchHasResults']()).toBeTrue();
  }));

  it('should apply filters on region change', () => {
    const applyFiltersSpy = spyOn<any>(component, 'applyFilters');
    component.onRegionChange();
    expect(applyFiltersSpy).toHaveBeenCalled();
  });

  it('should call applyFilters when search term is empty', fakeAsync(() => {
    const applyFiltersSpy = spyOn<any>(component, 'applyFilters');

    component.onSearchChange('');
    tick(300);

    expect(applyFiltersSpy).toHaveBeenCalled();
  }));

  it('should set searchHasResults to false if no matches found', fakeAsync(() => {
    component.selectedRegion = 'Invalid';
    component.searchTerm = 'NoMatch';
    mockCountryService.getAllCountries.and.returnValue(of(mockCountries));

    component['applyFilters']();
    tick();

    expect(component['searchHasResults']()).toBeFalse();
    expect(component.countries().length).toBe(0);
  }));

  it('should set searchHasResults to false when no country matches filter', fakeAsync(() => {
    component['viewport'] = {
      scrollToIndex: () => {},
      checkViewportSize: () => {}
    } as any;

    component.searchTerm = 'doesnotexist';
    component.selectedRegion = '';
    mockCountryService.getAllCountries.and.returnValue(of(mockCountries));
    const detectChangesSpy = spyOn(component['cdr'], 'detectChanges');

    component['applyFilters']();
    tick();

    expect(component.countries().length).toBe(0);
    expect(component['searchHasResults']()).toBeFalse();
    expect(detectChangesSpy).toHaveBeenCalled();
  }));

  it('should debounce search input and call applyFilters', fakeAsync(() => {
    spyOn<any>(component, 'applyFilters');
    component.onSearchChange('Test');
    tick(300);
    expect(component['applyFilters']).toHaveBeenCalled();
  }));

  it('should navigate to country detail on viewCountryDetail', () => {
    component.viewCountryDetail('TST');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/country', 'TST']);
  });

  it('should call toggleFavorite on the store', () => {
    component.toggleFavorite(mockCountries[0]);
    expect(mockFavoritesStore.toggleFavorite).toHaveBeenCalledWith(mockCountries[0]);
  });

  it('should set hasMore to false if less than pageSize returned', () => {
    component['pageSize'] = 20;
    component['currentPage'] = 2;
    component.countries.set([...mockCountries]);
    component['checkIfHasMore']();
    expect(component.hasMore).toBeFalse();
  });

  it('should load more countries when hasMore is true and not already loading', fakeAsync(() => {
    component['currentPage'] = 2;
    component['hasMore'] = true;
    component.isLoading.set(false);
    component['viewport'] = {
      checkViewportSize: () => {},
    } as any;

    const newCountries = [...mockCountries];
    mockCountryService.getAllCountries.and.returnValue(of(newCountries));
    const detectChangesSpy = spyOn(component['cdr'], 'detectChanges');

    component['countries'].set(mockCountries);

    component.loadMore();
    tick();

    expect(component['countries']()).toEqual([...mockCountries, ...newCountries]);
    expect(component['currentPage']).toBe(3);
    expect(component.isLoading()).toBeFalse();
    expect(detectChangesSpy).toHaveBeenCalled();
  }));

  it('should correctly set hasMore in checkIfHasMore()', () => {
    component['pageSize'] = 2;
    component['currentPage'] = 2;
    component.countries.set(mockCountries);
    component['checkIfHasMore']();
    expect(component.hasMore).toBeTrue();
  });

  it('should handle error when loading more countries', fakeAsync(() => {
    const error = new Error('Failed to load');
    component['hasMore'] = true;
    component.isLoading.set(false);
    component['viewport'] = { checkViewportSize: () => {} } as any;

    mockCountryService.getAllCountries.and.returnValue(throwError(() => error));
    const consoleSpy = spyOn(console, 'error');
    
    component.loadMore();
    tick();

    expect(component.isLoading()).toBeFalse();
    expect(consoleSpy).toHaveBeenCalledWith('Error loading more countries: ', error);
  }));

  it('should apply region filter', fakeAsync(() => {
    component.selectedRegion = 'Test Region';
    component.searchTerm = '';
    component['viewport'] = {
      scrollToIndex: () => {},
      checkViewportSize: () => {}
    } as any;

    mockCountryService.getAllCountries.and.returnValue(of(mockCountries));

    const detectChangesSpy = spyOn(component['cdr'], 'detectChanges');

    component['applyFilters']();
    tick();

    expect(component.countries().every(c => c.region === 'Test Region')).toBeTrue();
    expect(detectChangesSpy).toHaveBeenCalled();
  }));

  it('should handle navigation event in setupNavigationListener', fakeAsync(() => {
    const navigationEnd = new NavigationEnd(1, '/previous', '/current');
    const routerEvents$ = new Subject<any>();

    mockRouter = jasmine.createSpyObj('Router', ['navigate'], { events: routerEvents$.asObservable() });
    (component as any).router = mockRouter;

    const handleNavigationSpy = spyOn<any>(component, 'handleNavigation');

    (component as any).setupNavigationListener();

    routerEvents$.next(navigationEnd);
    tick();

    expect(handleNavigationSpy).toHaveBeenCalled();
  }));

  it('should navigate to detail page when viewCountryDetail is called', () => {
    component.viewCountryDetail('USA');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/country', 'USA']);
  });

  it('should toggle favorite when toggleFavorite is called', () => {
    const country = mockCountries[0];
    component.toggleFavorite(country);
    expect(mockFavoritesStore.toggleFavorite).toHaveBeenCalledWith(country);
  });
});