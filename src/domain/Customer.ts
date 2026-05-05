/**
 * Customer is an OOP representation of a store customer.
 * All identity-bearing fields are strictly private (#) and exposed via getters.
 * Behaviour methods (`payBill`, `applyPenalty`) keep balance arithmetic
 * encapsulated rather than scattered across route handlers.
 */
export const PENALTY_PERCENT = 2;

export class Customer {
  #id: number;
  #name: string;
  #phone: string;
  #email: string | null;
  #notes: string | null;
  #trustScore: number;

  constructor(opts: {
    id: number;
    name: string;
    phone: string;
    email?: string | null;
    notes?: string | null;
    trustScore?: number;
  }) {
    this.#id = opts.id;
    this.#name = opts.name;
    this.#phone = opts.phone;
    this.#email = opts.email ?? null;
    this.#notes = opts.notes ?? null;
    this.#trustScore = opts.trustScore ?? 0;
  }

  get id(): number {
    return this.#id;
  }
  get name(): string {
    return this.#name;
  }
  get phone(): string {
    return this.#phone;
  }
  get email(): string | null {
    return this.#email;
  }
  get notes(): string | null {
    return this.#notes;
  }
  get trustScore(): number {
    return this.#trustScore;
  }

  /** Camotes Online Store unique customer code, e.g. COS-101 for id=1. */
  get code(): string {
    return `COS-${this.#id + 100}`;
  }

  /** Parse a customer code like "COS-101" back to a numeric id. */
  static idFromCode(code: string): number | null {
    const match = /^COS-(\d+)$/i.exec(code.trim());
    if (!match) return null;
    const numeric = Number(match[1]);
    if (Number.isNaN(numeric)) return null;
    const id = numeric - 100;
    return id > 0 ? id : null;
  }

  /**
   * Apply a payment to a balance. Returns the remaining balance, never below zero.
   * Encapsulates the "you cannot overpay" rule.
   */
  payBill(currentBalance: number, amount: number): number {
    if (amount < 0) {
      throw new Error("Payment amount must be non-negative");
    }
    const remaining = currentBalance - amount;
    return remaining < 0 ? 0 : Number(remaining.toFixed(2));
  }

  /**
   * Adds a 2% penalty to a balance when the order is past due.
   * Pure function; callers persist the new total separately.
   */
  applyPenalty(balance: number, isOverdue: boolean): number {
    if (!isOverdue || balance <= 0) return Number(balance.toFixed(2));
    return Number((balance * (1 + PENALTY_PERCENT / 100)).toFixed(2));
  }

  /**
   * Tier ceiling for new e-loans, derived from trust score.
   * 0   -> ₱1,000   (new account)
   * 1-2 -> ₱3,000
   * 3-4 -> ₱6,000
   * 5+  -> ₱10,000  (good payer)
   */
  loanCeiling(): number {
    const t = this.#trustScore;
    if (t >= 5) return 10000;
    if (t >= 3) return 6000;
    if (t >= 1) return 3000;
    return 1000;
  }
}
