import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import GeoRecommendations from '../src/components/home/GeoRecommendations';
import { COUNTRIES, GEO_CERTS, normalizeCountry } from '../src/lib/home-geo';
import { certPath, type Locale } from '../src/lib/paths';
import { CERTS_BY_SLUG } from '../src/certifications/registry';
import { isPubliclyListed } from '../src/certifications/publication';

test('unknown and corrupt countries use general; only supported choices accepted', () => {
  for (const value of [null, undefined, '', 'DE', 'us', '<script>', '{}']) assert.equal(normalizeCountry(value), 'general');
  for (const code of COUNTRIES) assert.equal(normalizeCountry(code), code);
});
test('every editorial suggestion is public, unique and limited to two; EIPASS excluded', () => {
  for (const slugs of Object.values(GEO_CERTS)) {
    assert.equal(slugs.length, 2);
    assert.equal(new Set(slugs).size, 2);
    for (const slug of slugs) {
      assert.ok(CERTS_BY_SLUG[slug], slug);
      assert.ok(isPubliclyListed(slug, CERTS_BY_SLUG), slug);
      assert.doesNotMatch(slug, /eipass|digcomp/i);
    }
  }
});
for (const lang of ['it', 'en', 'fr', 'es'] as Locale[]) {
  test(`${lang}: server HTML always has general anchors without JavaScript`, () => {
    const html = renderToStaticMarkup(<GeoRecommendations lang={lang} />);
    for (const slug of GEO_CERTS.general) assert.ok(html.includes(`href="${certPath(lang, slug)}"`));
    assert.equal((html.match(/<a /g) || []).length, 2);
    assert.equal((html.match(/<option /g) || []).length, 5);
    assert.doesNotMatch(html, /href=".*(?:country=|geo=)/);
  });
}

test('manual selection persists, survives remount and blocked storage; language stays independent', async () => {
  const { create, act } = await import('react-test-renderer');
  const memory = new Map<string, string>([['cq_home_country_v1', 'US']]);
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => memory.set(key, value),
  }});
  (globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
  let view: ReturnType<typeof create>;
  try {
    await act(async () => { view = create(<GeoRecommendations lang="fr" />); });
    assert.equal(view!.root.findByType('select').props.value, 'US');
    for (const code of COUNTRIES) {
      await act(async () => { view!.root.findByType('select').props.onChange({ target: { value: code } }); });
      assert.equal(memory.get('cq_home_country_v1'), code);
      assert.deepEqual(view!.root.findAllByType('a').map(a => a.props.href), GEO_CERTS[code].map(slug => certPath('fr', slug)));
    }
    await act(async () => { view!.unmount(); });
    await act(async () => { view = create(<GeoRecommendations lang="es" />); });
    assert.equal(view!.root.findByType('select').props.value, 'MX');
    await act(async () => { view!.unmount(); });
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get: () => { throw Error('blocked'); } });
    await act(async () => { view = create(<GeoRecommendations lang="it" />); });
    assert.equal(view!.root.findByType('select').props.value, 'general');
    await act(async () => { view!.root.findByType('select').props.onChange({ target: { value: 'IT' } }); });
    assert.equal(view!.root.findByType('select').props.value, 'IT');
    await act(async () => { view!.unmount(); });
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
