import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FourDevsApi } from '../../src/api/types.js';
import { gerarCnhTool } from '../../src/tools/gerar-cnh.js';
import { gerarPisTool } from '../../src/tools/gerar-pis.js';
import { geradorCertidaoTool } from '../../src/tools/gerador-certidao.js';
import { gerarTituloEleitorTool } from '../../src/tools/gerar-titulo-eleitor.js';
import { brazilianUFs } from '../../src/schemas/tool-schemas.js';
import { createFakeApi } from '../helpers/fake-api.js';

const tools = [
  { tool: gerarCnhTool, method: 'gerarCnh' },
  { tool: gerarPisTool, method: 'gerarPis' },
  { tool: geradorCertidaoTool, method: 'gerarCertidao' },
  { tool: gerarTituloEleitorTool, method: 'gerarTituloEleitor' }
] as const;

const invalidResponses = [
  ['an empty', ''],
  ['a whitespace-only', '  \n\t '],
  ['an HTML', '<html><body>Erro interno</body></html>'],
  ['a JSON error', '{"erro":"limite excedido"}'],
  ['a plain-text error', 'Fatal error: x on line 3'],
  ['a one-digit', '0'],
  ['a negative-number', '-1'],
  ['a mostly-punctuation', '.-/ 1'],
  ['an oversized', '9'.repeat(100000)]
] as const;

for (const { tool, method } of tools) {
  for (const [label, response] of invalidResponses) {
    test(`${tool.name} rejects ${label} response`, async () => {
      const api = createFakeApi({ [method]: async () => response } as Partial<FourDevsApi>);

      await assert.rejects(tool.execute(api, {}), /resposta inesperada da API 4Devs/);
    });
  }
}

// Formats seen in real responses (digits replaced by zeros)
for (const [tool, method, response] of [
  [gerarCnhTool, 'gerarCnh', '00000000000'],
  [gerarPisTool, 'gerarPis', '000.00000.00-0'],
  [geradorCertidaoTool, 'gerarCertidao', '000000 00 00 0000 0 00000 000 0000000-00'],
  [gerarTituloEleitorTool, 'gerarTituloEleitor', '000000000000']
] as const) {
  test(`${tool.name} accepts a well-formed number`, async () => {
    const api = createFakeApi({ [method]: async () => `${response}\n` } as Partial<FourDevsApi>);

    const result = await tool.execute(api, {});

    assert.ok(result.content[0].text.includes(`"${response}"`), result.content[0].text);
  });
}

test('gerar_titulo_eleitor without estado draws a valid UF', async () => {
  const sent: (string | undefined)[] = [];
  const fake = createFakeApi();
  const api = createFakeApi({
    gerarTituloEleitor: async (params) => {
      sent.push(params.estado);
      return fake.gerarTituloEleitor(params);
    }
  });

  const result = JSON.parse((await gerarTituloEleitorTool.execute(api, {})).content[0].text);

  assert.ok((brazilianUFs as readonly string[]).includes(result.estado), result.estado);
  assert.deepEqual(sent, [result.estado]);
});
