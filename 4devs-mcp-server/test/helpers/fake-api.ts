import { FourDevsApi, Pessoa } from '../../src/api/types.js';

/**
 * In-memory FourDevsApi for tests: valid canned responses by default,
 * overridable per test. Values are fictitious, not real documents.
 */
export function createFakeApi(overrides: Partial<FourDevsApi> = {}): FourDevsApi {
  return {
    gerarPessoa: async () => [{ nome: 'Pessoa Fictícia', idade: 30 } as Pessoa],
    carregarCidades: async () => '<option value="1">Cidade Fictícia</option>',
    gerarCertidao: async () => '00000000000000000000000000000000',
    gerarCnh: async () => '00000000000',
    gerarPis: async () => '00000000000',
    // Like the real API: without a UF the answer is not a valid number
    gerarTituloEleitor: async ({ estado }) => estado ? '000000000000' : '00000000ERRO00',
    ...overrides
  };
}
