import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gerarPessoaTool } from '../../src/tools/gerar-pessoa.js';
import { GeradorPessoaResponse } from '../../src/api/types.js';
import { createFakeApi } from '../helpers/fake-api.js';

const args = { sexo: 'I', txt_qtde: 1 };

for (const [label, response] of [
  ['an HTML page', '<html><body>Erro</body></html>'],
  ['an object', { erro: 'falhou' }],
  ['a list with non-objects', ['texto']],
  ['an empty list', []],
  ['a list of lists', [['x']]]
] as const) {
  test(`gerar_pessoa rejects ${label} from the API`, async () => {
    const api = createFakeApi({ gerarPessoa: async () => response as unknown as GeradorPessoaResponse });

    await assert.rejects(gerarPessoaTool.execute(api, args), /resposta inesperada da API 4Devs/);
  });
}

test('gerar_pessoa returns the people from the API', async () => {
  const result = await gerarPessoaTool.execute(createFakeApi(), args);

  assert.equal(JSON.parse(result.content[0].text)[0].nome, 'Pessoa Fictícia');
});
