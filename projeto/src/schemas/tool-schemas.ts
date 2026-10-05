import { z } from 'zod';

// Brazilian UF codes (27 Federal Units)
const brazilianUFs = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

// Gerar Pessoa Schema
export const gerarPessoaSchema = z.object({
  sexo: z.enum(['H', 'M', 'I']).describe('Gender: H (male), M (female), I (random)'),
  pontuacao: z.enum(['S', 'N']).optional().describe('Include punctuation in documents: S (yes), N (no)'),
  idade: z.number().int().min(0).optional().describe('Age (0 for random)'),
  cep_estado: z.enum(brazilianUFs).optional().describe('Brazilian state UF code'),
  txt_qtde: z.number().int().min(1).max(30).describe('Number of people to generate (1-30)'),
  cep_cidade: z.number().int().optional().describe('City code (requires cep_estado)')
}).refine(
  (data) => {
    // If cep_cidade is provided, cep_estado must also be provided
    if (data.cep_cidade !== undefined && !data.cep_estado) {
      return false;
    }
    return true;
  },
  {
    message: 'cep_cidade requires cep_estado to be provided'
  }
);

// Carregar Cidades Schema
export const carregarCidadesSchema = z.object({
  cep_estado: z.enum(brazilianUFs).describe('Brazilian state UF code')
});

// Gerador Certidao Schema
export const geradorCertidaoSchema = z.object({
  pontuacao: z.enum(['S', 'N']).optional().describe('Include punctuation: S (yes), N (no)'),
  tipo_certidao: z.enum([
    'nascimento',
    'casamento',
    'casamento_religioso',
    'obito',
    'Indiferente'
  ]).optional().describe('Certificate type')
});

// Gerar CNH Schema
export const gerarCnhSchema = z.object({}).describe('No parameters required');

// Gerar PIS Schema
export const gerarPisSchema = z.object({
  pontuacao: z.enum(['S', 'N']).optional().describe('Include punctuation: S (yes), N (no)')
});

// Gerar Titulo Eleitor Schema
export const gerarTituloEleitorSchema = z.object({
  estado: z.enum(brazilianUFs).optional().describe('Brazilian state UF code')
});

// Export types inferred from schemas
export type GerarPessoaInput = z.infer<typeof gerarPessoaSchema>;
export type CarregarCidadesInput = z.infer<typeof carregarCidadesSchema>;
export type GeradorCertidaoInput = z.infer<typeof geradorCertidaoSchema>;
export type GerarCnhInput = z.infer<typeof gerarCnhSchema>;
export type GerarPisInput = z.infer<typeof gerarPisSchema>;
export type GerarTituloEleitorInput = z.infer<typeof gerarTituloEleitorSchema>;