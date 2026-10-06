import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gerarPessoaSchema, carregarCidadesSchema, gerarTituloEleitorSchema } from '../../src/schemas/tool-schemas.js';

const pessoaValida = { sexo: 'I', txt_qtde: 1 };

test('gerar_pessoa accepts the minimal valid input', () => {
  assert.ok(gerarPessoaSchema.safeParse(pessoaValida).success);
});

for (const [label, input] of [
  ['txt_qtde 0', { ...pessoaValida, txt_qtde: 0 }],
  ['txt_qtde 31', { ...pessoaValida, txt_qtde: 31 }],
  ['cep_cidade without cep_estado', { ...pessoaValida, cep_cidade: 4205407 }],
  ['an invalid UF', { ...pessoaValida, cep_estado: 'XX' }],
  ['a negative idade', { ...pessoaValida, idade: -1 }]
] as const) {
  test(`gerar_pessoa rejects ${label}`, () => {
    assert.equal(gerarPessoaSchema.safeParse(input).success, false);
  });
}

test('carregar_cidades and gerar_titulo_eleitor reject an invalid UF', () => {
  assert.equal(carregarCidadesSchema.safeParse({ cep_estado: 'XX' }).success, false);
  assert.equal(gerarTituloEleitorSchema.safeParse({ estado: 'XX' }).success, false);
});
