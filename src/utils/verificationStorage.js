// Only the pending email/cooldown is saved in this tab; never save passwords or OTPs.
const KEY = "skilljob.verification";
export function readVerification() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}
export function saveVerification(email, sent = false) {
  const previous = readVerification();
  const value = {
    email,
    resendAt: sent
      ? Date.now() + 60000
      : previous.email === email
        ? previous.resendAt || 0
        : 0,
  };
  sessionStorage.setItem(KEY, JSON.stringify(value));
  return value;
}
export function clearVerification() {
  sessionStorage.removeItem(KEY);
}
