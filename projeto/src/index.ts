#!/usr/bin/env node

import { FourDevsServer } from './server.js';

/**
 * Entry point for the 4Devs MCP Server
 * 
 * This server provides tools for generating Brazilian documents and personal data
 * using the 4Devs API (https://www.4devs.com.br)
 * 
 * Available tools:
 * - gerar_pessoa: Generate random person data with valid Brazilian documents
 * - carregar_cidades: Load cities by Brazilian state (UF)
 * - gerador_certidao: Generate Brazilian certificate numbers
 * - gerar_cnh: Generate Brazilian driver's license numbers
 * - gerar_pis: Generate Brazilian PIS/NIS/PASEP numbers
 * - gerar_titulo_eleitor: Generate Brazilian voter registration numbers
 */

async function main() {
  try {
    const server = new FourDevsServer();
    await server.run();
  } catch (error) {
    console.error('[Error] Failed to start server:', error);
    process.exit(1);
  }
}

main();