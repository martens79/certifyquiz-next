import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// Inspect names only. Never print a rejected name: names may contain credentials.
export function isCredentialNote(path) {
  const normalized = path.replaceAll('\\', '/');
  const base = normalized.split('/').at(-1);
  return /^#\s*LOGIN\b/i.test(base)
    || /^types\/[^/]*LOGIN[^/]*\.txt$/i.test(normalized)
    || /^types\/(?:CERTIFIER_API_KEY|VITE_SANITY_).*\.txt$/i.test(normalized)
    || /^types\/[^/]*=[^/]*\.txt$/i.test(normalized)
    || /(?:API_KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL)\s*=/i.test(base);
}

export function checkTrackedNames() {
  const names = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
  const rejected = names.filter(isCredentialNote).length;
  console.log(JSON.stringify({ trackedFiles: names.length, credentialNoteNames: rejected, namesSuppressed: true }));
  return rejected === 0 ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = checkTrackedNames();
}
