import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { FourDevsServer } from '../../src/server.js';
import { createFakeApi } from '../helpers/fake-api.js';

const client = new Client({ name: 'test-client', version: '1.0.0' });

before(async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await new FourDevsServer(createFakeApi()).connect(serverTransport);
  await client.connect(clientTransport);
});

after(async () => {
  await client.close();
});

for (const name of ['gerar_cnh', 'gerar_pis', 'gerador_certidao', 'gerar_titulo_eleitor']) {
  test(`${name} accepts a call without arguments`, async () => {
    const result = await client.callTool({ name });

    assert.ok(!result.isError, JSON.stringify(result.content));
  });
}
