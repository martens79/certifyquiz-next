// Functional logout boundary only: no identity, credentials or analytics data.
export const AUTH_SESSION_KEY = 'cq:auth-session';
type Boundary = { generation: string; loggedOut: boolean; pending: boolean };
let fallback = '';
let serial = 0;
function read(): Boundary | null {
  let raw = fallback;
  try { raw = localStorage.getItem(AUTH_SESSION_KEY) || ''; }
  catch { try { raw = sessionStorage.getItem(AUTH_SESSION_KEY) || fallback; } catch {} }
  try { return raw ? JSON.parse(raw) as Boundary : null; } catch { return null; }
}
function write(value: Boundary) {
  fallback = JSON.stringify(value);
  try { localStorage.setItem(AUTH_SESSION_KEY, fallback); }
  catch { try { sessionStorage.setItem(AUTH_SESSION_KEY, fallback); } catch {} }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('cq:auth-session'));
}
export function authGeneration(): string { return read()?.generation || 'initial'; }
export function isExplicitlyLoggedOut(): boolean { return read()?.loggedOut === true; }
export function isLogoutPending(): boolean { return read()?.pending === true; }
export class AuthSessionChangedError extends Error {
  readonly status = 401;
  constructor() { super('Authentication session changed'); this.name = 'AuthSessionChangedError'; }
}
export function assertAuthGeneration(generation: string, allowLoggedOut = false) {
  if (generation !== authGeneration() || (!allowLoggedOut && isExplicitlyLoggedOut())) throw new AuthSessionChangedError();
}
function nextGeneration() { return `${Date.now()}:${++serial}:${Math.random().toString(36).slice(2)}`; }
export function beginExplicitLogout(): string {
  const generation = nextGeneration();
  write({ generation, loggedOut: true, pending: true });
  return generation;
}
export function confirmServerLogout(generation: string) {
  if (generation === authGeneration() && isExplicitlyLoggedOut()) write({ generation, loggedOut: true, pending: false });
}
// Only a successful explicit password/register/OAuth flow may reopen the boundary.
export function acceptExplicitLogin(generation: string) {
  assertAuthGeneration(generation, true);
  write({ generation: nextGeneration(), loggedOut: false, pending: false });
}
export function onAuthBoundaryChange(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const onStorage = (event: StorageEvent) => { if (event.key === AUTH_SESSION_KEY || event.key === null) callback(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener('cq:auth-session', callback);
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('cq:auth-session', callback); };
}
