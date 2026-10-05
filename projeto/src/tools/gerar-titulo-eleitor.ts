import { z } from 'zod';
import { FourDevsClient } from '../api/client.js';
import { gerarTituloEleitorSchema, GerarTituloEleitorInput } from '../schemas/tool-schemas.js';

/**
 * Tool: Generate Brazilian voter registration number
 * 
 * Generates a valid Brazilian Título de Eleitor (voter registration) number.
 * Can optionally specify a state (UF) for state-specific registration.
 */
export const gerarTituloEleitorTool = {
  name: 'gerar_titulo_eleitor',
  description: 'Generate a valid Brazilian voter registration number (Título de Eleitor). Can specify state (UF) for state-specific registration.',
  inputSchema: {
    type: 'object',
    properties: {
      estado: {
        type: 'string',
        enum: [
          'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
          'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
          'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ],
        description: 'Brazilian state UF code. If not provided, generates random state.'
      }
    },
    required: []
  } as const,

  async execute(client: FourDevsClient, args: unknown) {
    console.error('[Tool] Executing gerar_titulo_eleitor...');
    
    // Validate input
    const validatedArgs = gerarTituloEleitorSchema.parse(args) as GerarTituloEleitorInput;
    
    // Call API
    const result = await client.gerarTituloEleitor(validatedArgs);
    
    console.error('[Tool] Voter registration generated successfully');
    
    // Handle both string and object responses
    const tituloNumber = typeof result === 'string' ? result.trim() : String(result).trim();
    
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            estado: validatedArgs.estado || 'random',
            titulo_eleitor: tituloNumber
          }, null, 2)
        }
      ]
    };
  }
};