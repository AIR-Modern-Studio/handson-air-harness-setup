import { z } from 'zod';
import { FourDevsClient } from '../api/client.js';
import { carregarCidadesSchema, CarregarCidadesInput } from '../schemas/tool-schemas.js';

/**
 * Tool: Load cities by Brazilian state
 * 
 * Returns a list of cities for a given Brazilian state (UF).
 * The response is HTML with <option> tags containing city codes and names.
 * 
 * Use this tool to get city codes for the gerar_pessoa tool's cep_cidade parameter.
 */
export const carregarCidadesTool = {
  name: 'carregar_cidades',
  description: 'Load list of cities for a Brazilian state (UF). Returns city codes that can be used with gerar_pessoa tool.',
  inputSchema: {
    type: 'object',
    properties: {
      cep_estado: {
        type: 'string',
        enum: [
          'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
          'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
          'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ],
        description: 'Brazilian state UF code'
      }
    },
    required: ['cep_estado']
  } as const,

  async execute(client: FourDevsClient, args: unknown) {
    console.error('[Tool] Executing carregar_cidades...');
    
    // Validate input
    const validatedArgs = carregarCidadesSchema.parse(args) as CarregarCidadesInput;
    
    // Call API
    const result = await client.carregarCidades(validatedArgs);
    
    // Parse HTML to extract city information
    const cityMatches = result.matchAll(/<option value="(\d+)">([^<]+)<\/option>/g);
    const cities = Array.from(cityMatches).map(match => ({
      code: parseInt(match[1]),
      name: match[2]
    }));
    
    console.error(`[Tool] Loaded ${cities.length} cities for ${validatedArgs.cep_estado}`);
    
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            estado: validatedArgs.cep_estado,
            total_cidades: cities.length,
            cidades: cities
          }, null, 2)
        }
      ]
    };
  }
};