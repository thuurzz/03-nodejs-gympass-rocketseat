export class LateCheckInError extends Error {
  constructor() {
    super("Check-in is late, only 20 minutes after check-in is allowed");
  }
}
