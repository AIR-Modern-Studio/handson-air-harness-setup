import { z } from 'zod';
import { FourDevsClient } from '../api/client.js';
import { gerarPisSchema, GerarPisInput } from '../schemas/tool-schemas.js';

/**
 * Tool: Generate Brazilian PIS number
 * 
 * Generates a valid Brazilian PIS (Programa de Integração Social) number.
 * Also known as NIS (Número de Identificação Social) or PASEP.
 * 
 * Can optionally include punctuation formatting.
 */
export const gerarPisTool = {
  name: 'gerar_pis',
  description: 'Generate a valid Brazilian PIS/NIS/PASEP number (social security). Can include punctuation formatting.',
  inputSchema: {
    type: 'object',
    properties: {
      pontuacao: {
        type: 'string',
        enum: ['S', 'N'],
        description: 'Include punctuation: S (yes), N (no). Default: N'
      }
    },
    required: []
  } as const,

  async execute(client: FourDevsClient, args: unknown) {
    console.error('[Tool] Executing gerar_pis...');
    
    // Validate input
    const validatedArgs = gerarPisSchema.parse(args) as GerarPisInput;
    
    // Call API
    const result = await client.gerarPis(validatedArgs);
    
    console.error('[Tool] PIS generated successfully');
    
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            pis: result.trim()
          }, null, 2)
        }
      ]
    };
  }
};