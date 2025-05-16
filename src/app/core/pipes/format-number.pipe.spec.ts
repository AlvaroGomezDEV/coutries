import { FormatNumberPipe } from './format-number.pipe';

describe('FormatNumberPipe', () => {
  let pipe: FormatNumberPipe;

  beforeEach(() => {
    pipe = new FormatNumberPipe();
  });

  it('debe crear una instancia', () => {
    expect(pipe).toBeTruthy();
  });

  it('debe formatear un número entero grande', () => {
    expect(pipe.transform(1234567)).toBe("1'234.567");
  });

  it('debe formatear un número con decimales', () => {
    expect(pipe.transform(1234567.89)).toBe("1'234.567,89");
  });

  it('debe devolver vacío si el valor es undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('debe devolver vacío si el valor es null', () => {
    expect(pipe.transform(null as any)).toBe('');
  });

  it('debe devolver vacío si el valor es NaN', () => {
    expect(pipe.transform(NaN)).toBe('');
  });

  it('debe formatear un string numérico', () => {
    expect(pipe.transform(Number('1234567'))).toBe("1'234.567");
  });

  it('debe formatear números pequeños', () => {
    expect(pipe.transform(12)).toBe('12');
    expect(pipe.transform(123)).toBe('123');
    expect(pipe.transform(1234)).toBe('1.234');
  });
});
