// Functional logout boundary only: no identity, credentials or analytics data.
export const AUTH_SESSION_KEY = 'cq:auth-session';
type Boundary = { generation: string; loggedOut: boolean; pending: boolean; at: number };
let fallback = '';
let serial = 0;
function read(): Boundary | null {
  const values = [fallback];
  try { values.push(localStorage.getItem(AUTH_SESSION_KEY) || ''); } catch {}
  try { values.push(sessionStorage.getItem(AUTH_SESSION_KEY) || ''); } catch {}
  const boundaries: Boundary[] = [];
  for (const raw of values) {
    try {
      const value = JSON.parse(raw) as Boundary;
      if (typeof value.generation === 'string' && Number.isFinite(value.at) && typeof value.loggedOut === 'boolean') boundaries.push(value);
    } catch {}
  }
  // A readable but full localStorage must not override a newer session fallback.
  return boundaries.sort((a, b) => b.at - a.at || Number(b.loggedOut) - Number(a.loggedOut))[0] || null;
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
function nextGeneration() {
  const at = Math.max(Date.now(), (read()?.at || 0) + 1);
  return { at, generation: `${at}:${++serial}:${Math.random().toString(36).slice(2)}` };
}
export function beginExplicitLogout(): string {
  const next = nextGeneration();
  write({ ...next, loggedOut: true, pending: true });
  return next.generation;
}
export function confirmServerLogout(generation: string) {
  const current = read();
  if (generation === current?.generation && current.loggedOut) write({ ...current, pending: false });
}
// Only a successful explicit password/register/OAuth flow may reopen the boundary.
export function acceptExplicitLogin(generation: string) {
  assertAuthGeneration(generation, true);
  write({ ...nextGeneration(), loggedOut: false, pending: false });
}
export function onAuthBoundaryChange(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const onStorage = (event: StorageEvent) => { if (event.key === AUTH_SESSION_KEY || event.key === null) callback(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener('cq:auth-session', callback);
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('cq:auth-session', callback); };
}
