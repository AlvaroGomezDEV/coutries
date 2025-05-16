import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CountryService } from '../../../core/services/country.service'
import { Country } from '../../../core/models/country.model';
import { CountryCardComponent } from '../country-card/country-card.component';
import { filter, Subscription, throttleTime } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { FavoritesStore } from '../../../core/store/favorites.store';

@Component({
  selector: 'app-country-list',
  imports: [CountryCardComponent, ScrollingModule],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.scss',
  providers: [CountryService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryListComponent implements AfterViewInit, AfterViewChecked, OnDestroy {

  private readonly router = inject(Router);

  private readonly countryService = inject(CountryService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly cdr = inject(ChangeDetectorRef);

  private scrollListenerActive = false;

  protected readonly favoritesStore = inject(FavoritesStore);
  
  private pageSize = 20;
  
  private currentPage = 1;

  protected countries = signal<Country[]>([]);

  protected isLoading = signal(false);

  protected hasMore = true;

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  private scrollSubscription?: Subscription;

  ngAfterViewInit() {
    this.setupNavigationListener();
    this.initializeComponent();
  }

  ngAfterViewChecked() {
    if (this.viewport && !this.scrollListenerActive) {
      this.setupScrollListener();
    }
  }

  private setupNavigationListener() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.handleNavigation();
    });
  }

  private handleNavigation() {
    this.currentPage = 1;
    this.hasMore = true;
    this.countries.set([]);
    this.scrollSubscription?.unsubscribe();

    const waitForViewport = () => {
      if (this.viewport) {
        this.viewport.scrollToIndex(0);
        this.viewport.checkViewportSize();
        this.cdr.detectChanges();

        this.loadInitialData();
        this.setupScrollListener();
      } else {
        setTimeout(waitForViewport, 50);
      }
    };
    waitForViewport();
  }

  private initializeComponent() {
    this.loadInitialData();
    this.setupScrollListener();
  }

  private shouldLoadMore(): boolean {
    if (!this.viewport || this.isLoading() || !this.hasMore) {
      return false;
    }

    const viewportSize = this.viewport.getViewportSize();
    const totalContentSize = this.viewport.getDataLength();
    const scrollOffset = this.viewport.measureScrollOffset();

    return (totalContentSize - viewportSize - scrollOffset) < 10;
  }

  loadInitialData() {
    this.isLoading.set(true);
    this.countryService.getAllCountries(this.currentPage, this.pageSize).subscribe({
      next: (newCountries) => {
        this.countries.set(newCountries);
        this.currentPage++;
        this.isLoading.set(false);
        this.checkIfHasMore();
        
        if (this.viewport) {
          this.viewport.checkViewportSize();
          this.cdr.detectChanges();
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadMore() {
    if (!this.hasMore || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.countryService.getAllCountries(this.currentPage, this.pageSize).subscribe({
      next: (newCountries) => {
        if (newCountries.length === 0) {
          this.hasMore = false;
        } else {
          this.countries.update(current => [...current, ...newCountries]);
          this.currentPage++;
        }
        this.isLoading.set(false);
        this.checkIfHasMore();
        
        if (this.viewport) {
          this.viewport.checkViewportSize();
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error("Error loading more countries: ", error);
      }
    });
  }

  private setupScrollListener() {
    this.scrollSubscription?.unsubscribe();

    if (this.viewport) {
      this.scrollSubscription = this.viewport.elementScrolled().pipe(
        throttleTime(300),
        filter(() => this.shouldLoadMore()),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.loadMore();
      });
    }
  }

  private checkIfHasMore() {
    const lastLoadCount = this.countries().length % this.pageSize;
    this.hasMore = lastLoadCount === 0 && this.countries().length === (this.currentPage - 1) * this.pageSize;
  }

  viewCountryDetail(code: string) {
    this.router.navigate(['/country', code]);
  }

  toggleFavorite(country: Country): void {
    this.favoritesStore.toggleFavorite(country);
  }

  ngOnDestroy() {
    this.scrollSubscription?.unsubscribe();
  }
}
