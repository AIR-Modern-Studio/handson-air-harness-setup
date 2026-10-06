import { FourDevsApi } from '../api/types.js';
import { requireText } from './api-response.js';
import { gerarTituloEleitorSchema, GerarTituloEleitorInput, brazilianUFs } from '../schemas/tool-schemas.js';

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

  async execute(client: FourDevsApi, args: unknown) {
    console.error('[Tool] Executing gerar_titulo_eleitor...');
    
    // Validate input
    const validatedArgs = gerarTituloEleitorSchema.parse(args) as GerarTituloEleitorInput;
    
    // Without a UF the API answers with an invalid number, so draw one as the description promises
    const estado = validatedArgs.estado ?? brazilianUFs[Math.floor(Math.random() * brazilianUFs.length)];
    
    // Call API
    const result = await client.gerarTituloEleitor({ estado });
    const tituloNumber = requireText(result);
    
    console.error('[Tool] Voter registration generated successfully');
    
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            estado,
            titulo_eleitor: tituloNumber
          }, null, 2)
        }
      ]
    };
  }
};