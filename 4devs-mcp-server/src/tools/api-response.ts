/**
 * Helpers to validate 4Devs API responses before they reach the LLM.
 * Anything unexpected becomes an error instead of a "success" with raw content.
 */
export function unexpectedApiResponse(detail: string): Error {
  return new Error(`resposta inesperada da API 4Devs: ${detail}`);
}

/**
 * Validate a plain-text document number: digits plus formatting characters
 * (. - / and spaces), so error pages or messages never pass as a number.
 * Every generated document has 10 to 40 digits (CNH and PIS 11, título 12, certidão 32).
 */
export function requireText(result: string): string {
  const text = result.trim();

  if (text === '') {
    throw unexpectedApiResponse('resposta vazia');
  }

  const digits = text.replace(/\D/g, '').length;
  if (!/^[\d.\-\/ ]+$/.test(text) || digits < 10 || digits > 40) {
    throw unexpectedApiResponse('conteúdo não reconhecido como número de documento');
  }

  return text;
}
