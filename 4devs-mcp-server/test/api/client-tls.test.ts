import { test } from 'node:test';
import assert from 'node:assert/strict';
import axios, { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { createHttpClient, FourDevsClient } from '../../src/api/client.js';

type MaybeAgent = { options?: { rejectUnauthorized?: boolean } } | undefined;

test('createHttpClient keeps TLS certificate verification on', () => {
  const agent = createHttpClient().defaults.httpsAgent as MaybeAgent;

  assert.notEqual(agent?.options?.rejectUnauthorized, false);
});

test('FourDevsClient requests keep TLS certificate verification on', async () => {
  // Instances copy axios.defaults when created, so a fake adapter set here sees the final request config
  const originalAdapter = axios.defaults.adapter;
  let sentConfig: InternalAxiosRequestConfig | undefined;
  const fakeAdapter: AxiosAdapter = async (config) => {
    sentConfig = config;
    return { data: '00000000000', status: 200, statusText: 'OK', headers: {}, config };
  };

  axios.defaults.adapter = fakeAdapter;
  try {
    await new FourDevsClient().gerarCnh();
  } finally {
    axios.defaults.adapter = originalAdapter;
  }

  assert.ok(sentConfig, 'the request did not reach the adapter');
  assert.equal(sentConfig.baseURL, 'https://www.4devs.com.br');
  assert.notEqual((sentConfig.httpsAgent as MaybeAgent)?.options?.rejectUnauthorized, false);
});
