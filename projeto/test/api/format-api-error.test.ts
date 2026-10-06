import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatApiError } from '../../src/api/client.js';

test('formatApiError serializes an object body', () => {
  const message = formatApiError({ message: 'Request failed', response: { status: 400, data: { erro: 'parâmetro inválido' } } });

  assert.match(message, /400/);
  assert.match(message, /parâmetro inválido/);
  assert.doesNotMatch(message, /\[object Object\]/);
});

test('formatApiError strips tags and truncates an HTML body', () => {
  const html = `<html><head><style>body { color: red; }</style><script>var x = 1;</script></head>
    <body><h1>503 Service Unavailable</h1><p>${'Tente novamente mais tarde. '.repeat(20)}</p></body></html>`;

  const message = formatApiError({ message: 'Request failed', response: { status: 503, data: html } });
  const detail = message.slice(message.indexOf('503 Service'));

  assert.match(message, /HTTP 503/);
  assert.match(message, /503 Service Unavailable/);
  assert.doesNotMatch(message, /[<>]/);
  assert.doesNotMatch(message, /color: red|var x/);
  assert.ok(detail.length <= 200, `detail has ${detail.length} characters`);
});

test('formatApiError decodes HTML entities', () => {
  const html = '<p>Servi&ccedil;o indispon&iacute;vel&nbsp;agora &#8211; tente &Agrave; tarde &amp; &#xE9;</p>';

  const message = formatApiError({ message: 'Request failed', response: { status: 500, data: html } });

  assert.equal(message, '4Devs API error: HTTP 500 - Serviço indisponível agora – tente À tarde & é');
});

test('formatApiError does not bring tags back when decoding &lt; and &gt;', () => {
  const message = formatApiError({ message: 'Request failed', response: { status: 500, data: '<p>&lt;b&gt;negrito&lt;/b&gt;</p>' } });

  assert.doesNotMatch(message, /[<>]/);
  assert.match(message, /negrito/);
});

test('formatApiError decodes entities only once', () => {
  const message = formatApiError({ message: 'Request failed', response: { status: 500, data: '&#38;lt;b&#38;gt;' } });

  assert.equal(message, '4Devs API error: HTTP 500 - &lt;b&gt;');
});

test('formatApiError drops control, format and lone surrogate characters', () => {
  const data = '<p>a&#27;b&#7;c&#x202E;d&#xD800;e\u0001f</p>';

  const message = formatApiError({ message: 'Request failed', response: { status: 500, data } });

  assert.equal(message, '4Devs API error: HTTP 500 - a b c d e f');
});

test('formatApiError handles unclosed tags in linear time', () => {
  const start = performance.now();
  const message = formatApiError({ message: 'Request failed', response: { status: 500, data: '<'.repeat(100000) } });
  const elapsed = performance.now() - start;

  assert.equal(message, '4Devs API error: HTTP 500');
  assert.ok(elapsed < 1000, `took ${Math.round(elapsed)} ms`);
});

test('formatApiError shows only the status for an empty body', () => {
  for (const data of [null, undefined, '', '   ']) {
    assert.equal(formatApiError({ message: 'Request failed', response: { status: 502, data } }), '4Devs API error: HTTP 502');
  }
});

test('formatApiError falls back to the error message without a response', () => {
  assert.match(formatApiError({ message: 'timeout of 30000ms exceeded' }), /timeout of 30000ms exceeded/);
});
