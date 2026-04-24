/**
 * Shared circuit breaker for coordinating failure detection across concurrent workers.
 *
 * When `threshold` consecutive scrape failures are recorded (from any worker),
 * the breaker trips and invokes `onTrip`. All workers should check `isTripped()`
 * before each scrape and abort if true.
 *
 * A successful scrape resets the consecutive failure counter.
 */
export class CircuitBreaker {
  private consecutiveFailures = 0;
  private tripped = false;

  constructor(
    private readonly threshold: number,
    private readonly onTrip: () => void,
  ) {}

  recordSuccess(): void {
    this.consecutiveFailures = 0;
  }

  recordFailure(): void {
    if (this.tripped) return;
    this.consecutiveFailures++;
    if (this.consecutiveFailures >= this.threshold) {
      this.tripped = true;
      this.onTrip();
    }
  }

  isTripped(): boolean {
    return this.tripped;
  }
}
