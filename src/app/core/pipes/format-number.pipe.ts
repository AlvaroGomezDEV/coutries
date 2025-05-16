import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if (value === null || value === undefined) return '';

    const valueNumber = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(valueNumber)) return '';

    const split = valueNumber.toString().split('.');
    let integer = split[0];
    const decimal = split[1] ? ',' + split[1] : '';

    let integerFormated = '';
    while (integer.length > 0) {
      if (integer.length > 6) {
        integerFormated =
          "'" +
          integer.slice(-6, -3) +
          '.' +
          integer.slice(-3) +
          integerFormated;
        integer = integer.slice(0, -6);
      } else if (integer.length > 3) {
        integerFormated = '.' + integer.slice(-3) + integerFormated;
        integer = integer.slice(0, -3);
      } else {
        integerFormated = integer + integerFormated;
        integer = '';
      }
    }

    return integerFormated + decimal;
  }
}
