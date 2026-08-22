import assert from 'node:assert/strict';
import test from 'node:test';
import { readConversionContext, safeInternalRedirect, withConversionContext } from '../src/lib/conversion-context.ts';

test('preserves assessment context and an internal study redirect', () => {
  const href = withConversionContext('/it/register', {
    source: 'assessment_result', certificationSlug: 'ccna', topicSlug: 'ipv6-basics',
    score: 73.4, redirect: '/it/quiz/ccna',
  });
  const query = new URL(href, 'https://www.certifyquiz.com').searchParams;
  assert.deepEqual(readConversionContext(query), {
    source: 'assessment_result', certificationSlug: 'ccna', topicSlug: 'ipv6-basics',
    score: 73, redirect: '/it/quiz/ccna',
  });
});

test('rejects external redirects and malformed conversion values', () => {
  assert.equal(safeInternalRedirect('//evil.example/path'), null);
  assert.equal(safeInternalRedirect('https://evil.example/path'), null);
  assert.equal(safeInternalRedirect('/\\evil.example/path'), null);
  assert.equal(safeInternalRedirect('/%2f%2fevil.example/path'), null);
  assert.equal(safeInternalRedirect('/bad%redirect'), null);
  const parsed = readConversionContext(new URLSearchParams('source=<script>&cert=ccna&score=999&redirect=//evil.example'));
  assert.equal(parsed.source, null);
  assert.equal(parsed.certificationSlug, 'ccna');
  assert.equal(parsed.score, null);
  assert.equal(parsed.redirect, null);
});

test('removes stale managed parameters while preserving unrelated query parameters', () => {
  assert.equal(
    withConversionContext('/it/register?mode=assessment&source=%3Cscript%3E&redirect=%2F%2Fevil.example', {
      certificationSlug: 'ccna',
    }),
    '/it/register?mode=assessment&cert=ccna',
  );
});
