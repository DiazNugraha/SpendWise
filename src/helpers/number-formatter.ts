export class NumberFormatter {
   private readonly formatter?: Intl.NumberFormat;

  constructor(props?: {
    maxFractionDigits?: number
  }) {
    if ( props?.maxFractionDigits && typeof props?.maxFractionDigits === 'number') {
      this.formatter = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: props.maxFractionDigits,
      });
    }
  }

  format(value: number): string {
    if (!this.formatter) {
      throw new Error('NumberFormatter: format() called without formatter');
    }
    return this.formatter.format(value);
  }

  static parse(text: string): number | null {
    const cleaned = text.replace(/[^\d.,]/g, '');
    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');

    let normalized = cleaned;

    if (lastDot > lastComma) {
      normalized = cleaned.replace(/,/g, '');
    } else if (lastComma > lastDot) {
      normalized = cleaned.replace(/\./g, '').replace(',', '.');
    }

    const num = Number(normalized);
    return Number.isNaN(num) ? null : num;
  }
}
