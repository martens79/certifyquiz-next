import assert from 'node:assert/strict';
import test from 'node:test';
import { isCredentialNote } from '../scripts/check-credential-filenames.mjs';

test('reject credential notes and env assignments used as filenames', () => {
  for (const path of [
    '# LOGIN fixture.txt',
    'types/# LOGIN fixture.txt',
    'types/CERTIFIER_API_KEY=synthetic.txt',
    'types/VITE_SANITY_API_VERSION=synthetic.txt',
    'types/OTHER_SETTING=synthetic.txt',
    'notes/API_KEY=synthetic.txt',
    'notes/SECRET=synthetic\nfixture.txt',
  ]) assert.equal(isCredentialNote(path), true);
});

test('allow declarations, ordinary text, and code handling credential variables', () => {
  for (const path of ['types/global.d.ts', 'types/example.txt', 'src/lib/sanity.server.ts',
    'docs/token-rotation.md', 'public/robots.txt', 'scripts/check-credential-filenames.mjs']) {
    assert.equal(isCredentialNote(path), false);
  }
});
