import { FormatNumberPipe } from './format-number.pipe';

describe('FormatNumberPipe', () => {
  let pipe: FormatNumberPipe;

  beforeEach(() => {
    pipe = new FormatNumberPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format a large integer', () => {
    expect(pipe.transform(1234567)).toBe("1'234.567");
  });

  it('should format a number with decimals', () => {
    expect(pipe.transform(1234567.89)).toBe("1'234.567,89");
  });

  it('should return empty if the value is undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty if the value is null', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty if the value is NaN', () => {
    expect(pipe.transform(NaN)).toBe('');
  });

  it('should format a numeric string', () => {
    expect(pipe.transform(Number('1234567'))).toBe("1'234.567");
  });

  it('should format small numbers', () => {
    expect(pipe.transform(12)).toBe('12');
    expect(pipe.transform(123)).toBe('123');
    expect(pipe.transform(1234)).toBe('1.234');
  });
});
