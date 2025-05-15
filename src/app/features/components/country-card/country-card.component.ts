import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { Country } from '../../../core/models/country.model';
import { DecimalPipe, JsonPipe } from '@angular/common';
import { FormatNumberPipe } from '../../../core/pipes/format-number.pipe';

@Component({
  selector: 'app-country-card',
  imports: [FormatNumberPipe, DecimalPipe, JsonPipe],
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryCardComponent {

  public country = input.required<Country>();
}
