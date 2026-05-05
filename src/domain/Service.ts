/**
 * Service is the OOP wrapper for a catalog item with stock + installment helpers.
 * Stock counters are private; callers must go through getters / `isLowStock()`.
 */
export const LOW_STOCK_THRESHOLD = 3;

export class Service {
  #id: number;
  #name: string;
  #price: number;
  #quantity: number;
  #soldOut: boolean;

  constructor(opts: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    soldOut: boolean;
  }) {
    this.#id = opts.id;
    this.#name = opts.name;
    this.#price = opts.price;
    this.#quantity = opts.quantity;
    this.#soldOut = opts.soldOut;
  }

  get id(): number {
    return this.#id;
  }
  get name(): string {
    return this.#name;
  }
  get price(): number {
    return this.#price;
  }
  get quantity(): number {
    return this.#quantity;
  }
  get soldOut(): boolean {
    return this.#soldOut;
  }

  isLowStock(threshold: number = LOW_STOCK_THRESHOLD): boolean {
    return this.#quantity > 0 && this.#quantity < threshold;
  }

  isOutOfStock(): boolean {
    return this.#soldOut || this.#quantity <= 0;
  }

  /**
   * Spread the service price (or any principal) evenly across N periods using
   * the simple-interest formula:  Total = P * (1 + r * t)
   *
   * @param annualRatePercent annual interest rate as a percentage (e.g. 12 for 12%/yr)
   * @param months term in months (3, 6, 12, etc.)
   * @returns per-period payment, total interest, and total payable
   */
  calculateInstallments(
    annualRatePercent: number,
    months: number,
    principal: number = this.#price,
  ): {
    monthlyPayment: number;
    totalInterest: number;
    totalPayable: number;
  } {
    if (months <= 0) throw new Error("Months must be positive");
    const t = months / 12;
    const totalPayable = principal * (1 + (annualRatePercent / 100) * t);
    const totalInterest = totalPayable - principal;
    return {
      monthlyPayment: Number((totalPayable / months).toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      totalPayable: Number(totalPayable.toFixed(2)),
    };
  }
}
