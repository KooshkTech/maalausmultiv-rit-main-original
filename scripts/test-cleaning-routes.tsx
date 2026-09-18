import assert from 'node:assert/strict';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { CleaningLocationSeoPage } from '../src/pages/CleaningLocationSeoPage';

const services = ['toimistosiivous', 'yrityssiivous', 'muuttosiivous'];
const cities = ['helsinki', 'espoo', 'vantaa'];
for (const service of services) {
  for (const city of cities) {
    const path = `/palvelut/${service}/${city}`;
    const context: { helmet?: HelmetServerState } = {};
    const html = renderToString(
      <HelmetProvider context={context}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            {services.map(slug => <Route key={slug} path={`/palvelut/${slug}/:citySlug`} element={<CleaningLocationSeoPage />} />)}
          </Routes>
        </MemoryRouter>
      </HelmetProvider>,
    );
    assert.match(html, /<h1\b/);
    assert.match(html, /Pyydä tarjous/);
    assert.ok(!html.includes('Hups'));
    assert.ok(context.helmet?.link.toString().includes(`https://maalausmultivari.fi${path}`));
    console.log(`PASS ${path}`);
  }
}
