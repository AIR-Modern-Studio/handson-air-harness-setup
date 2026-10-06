import { test } from 'node:test';
import assert from 'node:assert/strict';
import { carregarCidadesTool } from '../../src/tools/carregar-cidades.js';
import { createFakeApi } from '../helpers/fake-api.js';

const args = { cep_estado: 'SC' };

test('carregar_cidades reads <option> tags with extra attributes', async () => {
  const html = [
    '<option value="">Selecione</option>',
    '<option value="4205407" selected>Florianópolis</option>',
    '<option data-uf="SC" value=\'4209102\'> Joinville </option>',
    '<option value="10" data-value="5">Cidade A</option>',
    '<option data-value="5" value="20">Cidade B</option>',
    '<option title=" value=99" value="7">Cidade C</option>',
    '<option value = "8">Cidade D</option>',
    '<option value="9" title="a>b">Cidade E</option>'
  ].join('\n');
  const api = createFakeApi({ carregarCidades: async () => html });

  const result = await carregarCidadesTool.execute(api, args);

  assert.deepEqual(JSON.parse(result.content[0].text).cidades, [
    { code: 4205407, name: 'Florianópolis' },
    { code: 4209102, name: 'Joinville' },
    { code: 10, name: 'Cidade A' },
    { code: 20, name: 'Cidade B' },
    { code: 7, name: 'Cidade C' },
    { code: 8, name: 'Cidade D' },
    { code: 9, name: 'Cidade E' }
  ]);
});

test('carregar_cidades fails when the HTML has no <option>', async () => {
  const api = createFakeApi({ carregarCidades: async () => '<html><body>Manutenção</body></html>' });

  await assert.rejects(carregarCidadesTool.execute(api, args), /resposta inesperada da API 4Devs/);
});

test('carregar_cidades handles malformed HTML in linear time', async () => {
  // Unclosed <option> tags: with a backtracking regex this takes seconds and blocks the event loop
  const api = createFakeApi({ carregarCidades: async () => '<option value=1 '.repeat(1250) });

  const start = performance.now();
  await assert.rejects(carregarCidadesTool.execute(api, args), /resposta inesperada da API 4Devs/);
  const elapsed = performance.now() - start;

  assert.ok(elapsed < 1000, `took ${Math.round(elapsed)} ms`);
});
