type RateRecord = { count: number; lastRequest: number };
const guestRateMap = new Map<string, RateRecord>();
const MAX_GUEST_REQUESTS = 1; // one free invoice

export function guestRateLimiter(ip: string) {
  const now = Date.now();
  const record = guestRateMap.get(ip);

  if (!record) {
    guestRateMap.set(ip, { count: 1, lastRequest: now });
    return true;
  }

  if (record.count >= MAX_GUEST_REQUESTS) return false;

  record.count++;
  guestRateMap.set(ip, { ...record, lastRequest: now });
  return true;
}
