import { z } from 'zod';
import { FourDevsClient } from '../api/client.js';
import { gerarPessoaSchema, GerarPessoaInput } from '../schemas/tool-schemas.js';

/**
 * Tool: Generate random Brazilian person data
 * 
 * Generates realistic Brazilian personal data including:
 * - Name, age, gender
 * - CPF, RG documents
 * - Address with CEP
 * - Contact information
 * - Physical characteristics
 * 
 * Can generate 1-30 people per request with customizable parameters.
 */
export const gerarPessoaTool = {
  name: 'gerar_pessoa',
  description: 'Generate random Brazilian person data with valid documents (CPF, RG), address, and contact information. Can generate 1-30 people per request.',
  inputSchema: {
    type: 'object',
    properties: {
      sexo: {
        type: 'string',
        enum: ['H', 'M', 'I'],
        description: 'Gender: H (male), M (female), I (random)'
      },
      pontuacao: {
        type: 'string',
        enum: ['S', 'N'],
        description: 'Include punctuation in documents: S (yes), N (no). Default: N'
      },
      idade: {
        type: 'number',
        description: 'Age (0 for random). Default: 0'
      },
      cep_estado: {
        type: 'string',
        enum: [
          'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
          'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
          'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ],
        description: 'Brazilian state UF code for address'
      },
      txt_qtde: {
        type: 'number',
        description: 'Number of people to generate (1-30)',
        minimum: 1,
        maximum: 30
      },
      cep_cidade: {
        type: 'number',
        description: 'City code (requires cep_estado). Use carregar_cidades tool to get city codes.'
      }
    },
    required: ['sexo', 'txt_qtde']
  } as const,

  async execute(client: FourDevsClient, args: unknown) {
    console.error('[Tool] Executing gerar_pessoa...');
    
    // Validate input
    const validatedArgs = gerarPessoaSchema.parse(args) as GerarPessoaInput;
    
    // Call API
    const result = await client.gerarPessoa(validatedArgs);
    
    console.error(`[Tool] Generated ${result.length} person(s)`);
    
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }
};