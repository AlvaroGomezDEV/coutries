import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

import { CountryService } from '../../../core/services/country.service'
import { Country } from '../../../core/models/country.model';
import { JsonPipe } from '@angular/common';
import { CountryCardComponent } from '../country-card/country-card.component';
import { filter, Subscription, throttleTime } from 'rxjs';

@Component({
  selector: 'app-country-list',
  imports: [CountryCardComponent, ScrollingModule, JsonPipe],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.scss',
  providers: [CountryService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryListComponent implements AfterViewInit, OnDestroy {

  private readonly countryService = inject(CountryService);

  private pageSize = 20;
  
  private currentPage = 1;
  
  protected countries = signal<Country[]>([]);
  
  protected isLoading = signal(false);

  protected hasMore = true;

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  private scrollSubscription!: Subscription;

  ngAfterViewInit() {
    this.loadInitialData();
    this.setupScrollListener();
  }

  private shouldLoadMore(): boolean {
    if (!this.viewport || this.isLoading() || !this.hasMore) return false;

    const viewportSize = this.viewport.getViewportSize();
    const totalContentSize = this.viewport.getDataLength();

    return (totalContentSize - viewportSize - this.viewport.measureScrollOffset()) < 10;
  }

  loadInitialData() {
    this.isLoading.set(true);
    this.countryService.getAllCountries(this.currentPage, this.pageSize).subscribe({
      next: (newCountries) => {
        this.countries.set(newCountries);
        this.currentPage++;
        this.isLoading.set(false);
        this.checkIfHasMore();
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadMore() {
    if (!this.hasMore || this.isLoading()) return;

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
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error loading more countries:', err);
      }
    });
  }

  private setupScrollListener() {
    this.scrollSubscription?.unsubscribe();

    this.scrollSubscription = this.viewport.scrolledIndexChange.pipe(
      throttleTime(300),
      filter(() => {
        const shouldLoad = this.shouldLoadMore();
        return shouldLoad;
      })
    ).subscribe(() => {
      this.loadMore();
    });
  }

  private checkIfHasMore() {
    const lastLoadCount = this.countries().length % this.pageSize;
    this.hasMore = lastLoadCount === 0 &&  this.countries().length === (this.currentPage - 1) * this.pageSize;
  }

  ngOnDestroy() {
    this.scrollSubscription?.unsubscribe();
  }
}
