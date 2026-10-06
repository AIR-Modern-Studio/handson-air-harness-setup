import { FourDevsApi } from '../api/types.js';
import { unexpectedApiResponse } from './api-response.js';
import { carregarCidadesSchema, CarregarCidadesInput } from '../schemas/tool-schemas.js';

/**
 * Read the value attribute of an <option>, ignoring text quoted inside other attributes.
 * Each token consumes its characters once, so the cost is linear.
 */
function optionValue(attributes: string): string | undefined {
  for (const [, name, ...values] of attributes.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?|[^\w:-]+/g)) {
    if (name?.toLowerCase() === 'value') {
      return values.find(value => value !== undefined);
    }
  }
  return undefined;
}

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

  async execute(client: FourDevsApi, args: unknown) {
    console.error('[Tool] Executing carregar_cidades...');
    
    // Validate input
    const validatedArgs = carregarCidadesSchema.parse(args) as CarregarCidadesInput;
    
    // Call API
    const result = await client.carregarCidades(validatedArgs);
    
    // Parse each <option> on its own (split + anchored regex), so malformed HTML stays linear time
    const cities = result.split(/<option\b/i).slice(1).flatMap(option => {
      const tag = /^((?:[^>"']|"[^"]*"|'[^']*')*)>([^<]*)<\/option>/i.exec(option);
      const code = tag ? optionValue(tag[1]) : undefined;
      const name = tag?.[2].trim();
      return code && /^\d+$/.test(code) && name ? [{ code: parseInt(code), name }] : [];
    });
    
    if (cities.length === 0) {
      throw unexpectedApiResponse(`nenhuma cidade encontrada para ${validatedArgs.cep_estado}`);
    }
    
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