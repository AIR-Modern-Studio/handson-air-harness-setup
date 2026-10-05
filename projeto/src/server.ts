import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import { FourDevsClient } from './api/client.js';
import { gerarPessoaTool } from './tools/gerar-pessoa.js';
import { carregarCidadesTool } from './tools/carregar-cidades.js';
import { geradorCertidaoTool } from './tools/gerador-certidao.js';
import { gerarCnhTool } from './tools/gerar-cnh.js';
import { gerarPisTool } from './tools/gerar-pis.js';
import { gerarTituloEleitorTool } from './tools/gerar-titulo-eleitor.js';
import { readmeResource } from './resources/readme-resource.js';

/**
 * 4Devs MCP Server
 * 
 * Provides tools for generating Brazilian documents and personal data
 * using the 4Devs API (https://www.4devs.com.br)
 */
export class FourDevsServer {
  private server: Server;
  private client: FourDevsClient;

  constructor() {
    console.error('[Setup] Initializing 4Devs MCP Server...');
    
    this.server = new Server(
      {
        name: '4devs-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.client = new FourDevsClient();
    this.setupHandlers();
    this.setupErrorHandling();
    
    console.error('[Setup] Server initialized successfully');
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      console.error('[Server] Listing available tools...');
      
      const tools: Tool[] = [
        {
          name: gerarPessoaTool.name,
          description: gerarPessoaTool.description,
          inputSchema: JSON.parse(JSON.stringify(gerarPessoaTool.inputSchema))
        },
        {
          name: carregarCidadesTool.name,
          description: carregarCidadesTool.description,
          inputSchema: JSON.parse(JSON.stringify(carregarCidadesTool.inputSchema))
        },
        {
          name: geradorCertidaoTool.name,
          description: geradorCertidaoTool.description,
          inputSchema: JSON.parse(JSON.stringify(geradorCertidaoTool.inputSchema))
        },
        {
          name: gerarCnhTool.name,
          description: gerarCnhTool.description,
          inputSchema: JSON.parse(JSON.stringify(gerarCnhTool.inputSchema))
        },
        {
          name: gerarPisTool.name,
          description: gerarPisTool.description,
          inputSchema: JSON.parse(JSON.stringify(gerarPisTool.inputSchema))
        },
        {
          name: gerarTituloEleitorTool.name,
          description: gerarTituloEleitorTool.description,
          inputSchema: JSON.parse(JSON.stringify(gerarTituloEleitorTool.inputSchema))
        }
      ];

      console.error(`[Server] Returning ${tools.length} tools`);
      return { tools };
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      console.error('[Server] Listing available resources...');
      
      const resources = [
        {
          uri: readmeResource.uri,
          name: readmeResource.name,
          description: readmeResource.description,
          mimeType: readmeResource.mimeType
        }
      ];

      console.error(`[Server] Returning ${resources.length} resources`);
      return { resources };
    });

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      console.error(`[Server] Resource read requested: ${request.params.uri}`);
      
      try {
        if (request.params.uri === readmeResource.uri) {
          return await readmeResource.read();
        }
        
        throw new Error(`Unknown resource: ${request.params.uri}`);
      } catch (error) {
        console.error('[Error] Resource read failed:', error);
        throw error;
      }
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      console.error(`[Server] Tool call requested: ${request.params.name}`);
      
      try {
        switch (request.params.name) {
          case gerarPessoaTool.name:
            return await gerarPessoaTool.execute(this.client, request.params.arguments);
          
          case carregarCidadesTool.name:
            return await carregarCidadesTool.execute(this.client, request.params.arguments);
          
          case geradorCertidaoTool.name:
            return await geradorCertidaoTool.execute(this.client, request.params.arguments);
          
          case gerarCnhTool.name:
            return await gerarCnhTool.execute(this.client, request.params.arguments);
          
          case gerarPisTool.name:
            return await gerarPisTool.execute(this.client, request.params.arguments);
          
          case gerarTituloEleitorTool.name:
            return await gerarTituloEleitorTool.execute(this.client, request.params.arguments);
          
          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        console.error('[Error] Tool execution failed:', error);
        
        if (error instanceof Error) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Error: ${error.message}`
              }
            ],
            isError: true
          };
        }
        
        throw error;
      }
    });
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[Error] Server error:', error);
    };

    process.on('SIGINT', async () => {
      console.error('[Server] Shutting down...');
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    console.error('[Server] Starting server with stdio transport...');
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('[Server] Server running and ready to accept requests');
  }
}