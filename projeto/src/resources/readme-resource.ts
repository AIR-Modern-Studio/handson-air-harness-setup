import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * MCP Resource: README Documentation
 * 
 * Provides access to the complete README.md documentation
 * through the MCP protocol as a resource.
 */
export const readmeResource = {
  uri: 'readme://documentation',
  name: '4Devs MCP Server Documentation',
  description: 'Complete documentation for the 4Devs MCP Server including installation, configuration, and usage examples',
  mimeType: 'text/markdown',
  
  async read() {
    try {
      const readmePath = join(__dirname, '../../README.md');
      const content = readFileSync(readmePath, 'utf-8');
      console.error('[Resource] README.md loaded successfully');
      
      return {
        contents: [
          {
            uri: this.uri,
            mimeType: this.mimeType,
            text: content
          }
        ]
      };
    } catch (error) {
      console.error('[Resource] Error reading README.md:', error);
      throw new Error('Failed to read README.md resource');
    }
  }
};