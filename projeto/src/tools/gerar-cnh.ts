import { FourDevsApi } from '../api/types.js';
import { requireText } from './api-response.js';
import { gerarCnhSchema } from '../schemas/tool-schemas.js';

/**
 * Tool: Generate Brazilian CNH (driver's license) number
 * 
 * Generates a valid Brazilian CNH (Carteira Nacional de Habilitação) number.
 * No parameters required - always generates a random valid CNH.
 */
export const gerarCnhTool = {
  name: 'gerar_cnh',
  description: 'Generate a valid Brazilian CNH (driver\'s license) number. No parameters required.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  } as const,

  async execute(client: FourDevsApi, args: unknown) {
    console.error('[Tool] Executing gerar_cnh...');
    
    // Validate input (empty object expected)
    gerarCnhSchema.parse(args);
    
    // Call API
    const result = await client.gerarCnh();
    const cnhNumber = requireText(result);
    
    console.error('[Tool] CNH generated successfully');
    
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            cnh: cnhNumber
          }, null, 2)
        }
      ]
    };
  }
};