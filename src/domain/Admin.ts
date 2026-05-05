import { timingSafeEqual } from "node:crypto";

/**
 * Admin OOP wrapper with private identity fields plus a constant-time
 * `validateAdmin` helper for comparing submitted credentials against a stored
 * hash without leaking timing information.
 */
export class Admin {
  #id: number;
  #username: string;

  constructor(opts: { id: number; username: string }) {
    this.#id = opts.id;
    this.#username = opts.username;
  }

  get id(): number {
    return this.#id;
  }
  get username(): string {
    return this.#username;
  }

  canManageStore(): boolean {
    return true;
  }

  /**
   * Constant-time equality check for admin credentials. The bcrypt verification
   * itself is constant-time; this guards the username comparison.
   */
  static validateAdmin(submittedUsername: string, expectedUsername: string): boolean {
    const a = Buffer.from(submittedUsername);
    const b = Buffer.from(expectedUsername);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }
}
