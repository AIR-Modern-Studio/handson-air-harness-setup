import { z } from 'zod';
import { FourDevsClient } from '../api/client.js';
import { gerarCnhSchema, GerarCnhInput } from '../schemas/tool-schemas.js';

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

  async execute(client: FourDevsClient, args: unknown) {
    console.error('[Tool] Executing gerar_cnh...');
    
    // Validate input (empty object expected)
    gerarCnhSchema.parse(args);
    
    // Call API
    const result = await client.gerarCnh();
    
    console.error('[Tool] CNH generated successfully');
    
    // Handle both string and object responses
    const cnhNumber = typeof result === 'string' ? result.trim() : String(result).trim();
    
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