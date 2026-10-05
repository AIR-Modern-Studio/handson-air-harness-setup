import { z } from 'zod';
import { FourDevsClient } from '../api/client.js';
import { geradorCertidaoSchema, GeradorCertidaoInput } from '../schemas/tool-schemas.js';

/**
 * Tool: Generate Brazilian certificate number
 * 
 * Generates valid Brazilian certificate numbers for:
 * - Birth certificates (nascimento)
 * - Marriage certificates (casamento)
 * - Religious marriage certificates (casamento_religioso)
 * - Death certificates (obito)
 * - Random type (Indiferente)
 */
export const geradorCertidaoTool = {
  name: 'gerador_certidao',
  description: 'Generate valid Brazilian certificate numbers (birth, marriage, death). Returns a formatted certificate number.',
  inputSchema: {
    type: 'object',
    properties: {
      pontuacao: {
        type: 'string',
        enum: ['S', 'N'],
        description: 'Include punctuation: S (yes), N (no). Default: N'
      },
      tipo_certidao: {
        type: 'string',
        enum: ['nascimento', 'casamento', 'casamento_religioso', 'obito', 'Indiferente'],
        description: 'Certificate type. Default: Indiferente (random)'
      }
    },
    required: []
  } as const,

  async execute(client: FourDevsClient, args: unknown) {
    console.error('[Tool] Executing gerador_certidao...');
    
    // Validate input
    const validatedArgs = geradorCertidaoSchema.parse(args) as GeradorCertidaoInput;
    
    // Call API
    const result = await client.gerarCertidao(validatedArgs);
    
    console.error('[Tool] Certificate generated successfully');
    
    // Result is now guaranteed to be a string due to responseType: 'text'
    const certidaoNumber = result.trim();
    
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            tipo_certidao: validatedArgs.tipo_certidao || 'Indiferente',
            numero: certidaoNumber
          }, null, 2)
        }
      ]
    };
  }
};