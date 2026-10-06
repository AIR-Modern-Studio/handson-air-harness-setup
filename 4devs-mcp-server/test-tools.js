#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'build', 'index.js');

console.log('🧪 Testing 4Devs MCP Server Tools\n');

// Test configuration
const tests = [
  {
    name: 'Test 1: gerar_cnh (no parameters)',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'gerar_cnh',
        arguments: {}
      }
    }
  },
  {
    name: 'Test 2: gerar_pis (with punctuation)',
    request: {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'gerar_pis',
        arguments: {
          pontuacao: 'S'
        }
      }
    }
  },
  {
    name: 'Test 3: gerador_certidao (birth certificate)',
    request: {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'gerador_certidao',
        arguments: {
          tipo_certidao: 'nascimento',
          pontuacao: 'S'
        }
      }
    }
  },
  {
    name: 'Test 4: gerar_titulo_eleitor (with state)',
    request: {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'gerar_titulo_eleitor',
        arguments: {
          estado: 'SP'
        }
      }
    }
  },
  {
    name: 'Test 5: carregar_cidades (Santa Catarina)',
    request: {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'carregar_cidades',
        arguments: {
          cep_estado: 'SC'
        }
      }
    }
  },
  {
    name: 'Test 6: gerar_pessoa (1 random person)',
    request: {
      jsonrpc: '2.0',
      id: 6,
      method: 'tools/call',
      params: {
        name: 'gerar_pessoa',
        arguments: {
          sexo: 'I',
          txt_qtde: 1
        }
      }
    }
  }
];

async function runTest(test) {
  return new Promise((resolve, reject) => {
    console.log(`\n📋 ${test.name}`);
    console.log(`Request: ${JSON.stringify(test.request, null, 2)}\n`);

    const server = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';
    let timeout;

    server.stdout.on('data', (data) => {
      output += data.toString();
    });

    server.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    server.on('close', (code) => {
      clearTimeout(timeout);
      
      if (code !== 0 && code !== null) {
        console.log(`❌ Test failed with exit code ${code}`);
        console.log('Error output:', errorOutput);
        resolve({ success: false, test: test.name, error: `Exit code ${code}` });
        return;
      }

      try {
        // Parse JSON-RPC responses from output
        const lines = output.split('\n').filter(line => line.trim());
        const responses = lines
          .filter(line => line.startsWith('{'))
          .map(line => {
            try {
              return JSON.parse(line);
            } catch {
              return null;
            }
          })
          .filter(r => r !== null);

        const response = responses.find(r => r.id === test.request.id);

        if (response && response.result) {
          console.log('✅ Test passed!');
          console.log('Response:', JSON.stringify(response.result, null, 2));
          resolve({ success: true, test: test.name, response: response.result });
        } else if (response && response.error) {
          console.log('❌ Test failed with error:', response.error);
          resolve({ success: false, test: test.name, error: response.error });
        } else {
          console.log('⚠️  No valid response received');
          console.log('Raw output:', output);
          resolve({ success: false, test: test.name, error: 'No valid response' });
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error.message);
        resolve({ success: false, test: test.name, error: error.message });
      }
    });

    // Send initialization
    server.stdin.write(JSON.stringify({
      jsonrpc: '2.0',
      id: 0,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    }) + '\n');

    // Wait a bit for initialization
    setTimeout(() => {
      // Send test request
      server.stdin.write(JSON.stringify(test.request) + '\n');
      
      // Set timeout for test
      timeout = setTimeout(() => {
        server.kill();
        console.log('⏱️  Test timed out');
        resolve({ success: false, test: test.name, error: 'Timeout' });
      }, 15000); // 15 second timeout per test
    }, 1000);
  });
}

async function runAllTests() {
  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
  console.log('\n\n📊 Test Summary');
  console.log('='.repeat(50));
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  
  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.test}: ${r.error}`);
    });
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});