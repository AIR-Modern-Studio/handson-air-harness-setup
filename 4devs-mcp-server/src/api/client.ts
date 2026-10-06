import axios, { AxiosInstance } from 'axios';
import {
  GeradorPessoaRequest,
  GeradorPessoaResponse,
  CarregarCidadesRequest,
  CarregarCidadesResponse,
  GeradorCertidaoRequest,
  GeradorCertidaoResponse,
  GeradorCnhRequest,
  GeradorCnhResponse,
  GeradorPisRequest,
  GeradorPisResponse,
  GeradorTituloEleitorRequest,
  GeradorTituloEleitorResponse,
  FourDevsApi
} from './types.js';

/**
 * Create the axios instance used to talk to the 4Devs API.
 * TLS certificates are verified (Node default); behind a TLS-inspecting
 * proxy, trust the corporate CA with NODE_EXTRA_CA_CERTS instead.
 */
export function createHttpClient(): AxiosInstance {
  const client = axios.create({
    baseURL: 'https://www.4devs.com.br',
    timeout: 30000, // 30 seconds timeout
    headers: {
      'User-Agent': '4devs-mcp-server/1.0.0'
    }
  });

  // Add request interceptor for logging
  client.interceptors.request.use(
    (config) => {
      console.error(`[API] Request to ${config.url}`);
      return config;
    },
    (error) => {
      console.error('[API] Request error:', error.message);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for logging
  client.interceptors.response.use(
    (response) => {
      console.error(`[API] Response status: ${response.status}`);
      return response;
    },
    (error) => {
      console.error('[API] Response error:', error.message);
      return Promise.reject(error);
    }
  );

  return client;
}

// Combining marks for accented-letter entities such as &ccedil; and &atilde;
const entityAccents: Record<string, string> = {
  acute: '\u0301', grave: '\u0300', circ: '\u0302', tilde: '\u0303', uml: '\u0308', cedil: '\u0327'
};
const namedEntities: Record<string, string> = {
  nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', ndash: '\u2013', mdash: '\u2014'
};

/**
 * Decode the HTML entities found in error pages: numeric, accented letters and the common named ones.
 * A single pass, so decoded text is never decoded again (&#38;lt; stays &lt;).
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z])(acute|grave|circ|tilde|uml|cedil)|([a-z]+));/gi,
      (entity, decimal, hex, letter, accent, name) => {
        if (decimal) return safeFromCodePoint(Number(decimal)) ?? entity;
        if (hex) return safeFromCodePoint(parseInt(hex, 16)) ?? entity;
        if (letter) return letter + entityAccents[accent.toLowerCase()];
        return namedEntities[name.toLowerCase()] ?? entity;
      })
    .normalize('NFC');
}

function safeFromCodePoint(code: number): string | undefined {
  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : undefined;
}

/**
 * Build a short, readable message from a failed API call: HTTP status plus
 * up to 200 characters of the body as plain text (no tags, scripts or styles)
 */
export function formatApiError(error: { message: string; response?: { status: number; data?: unknown } }): string {
  if (!error.response) {
    return `4Devs API error: ${error.message}`;
  }

  const { status, data } = error.response;
  const body = data === null || data === undefined ? '' : typeof data === 'string' ? data : JSON.stringify(data);
  const text = decodeHtmlEntities(
    body
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^<>]*>/g, ' ') // stops at the next <, so unclosed tags stay linear
  )
    .replace(/[\p{Cc}\p{Cf}\p{Cs}]/gu, ' ') // control, bidi/format and lone surrogate characters
    .replace(/[<>]/g, '') // decoded &lt;/&gt; must not bring tags back
    .replace(/\s+/g, ' ')
    .trim();
  const detail = Array.from(text).slice(0, 200).join(''); // by code point, never splitting a surrogate pair

  return detail ? `4Devs API error: HTTP ${status} - ${detail}` : `4Devs API error: HTTP ${status}`;
}

/**
 * Client for interacting with the 4Devs API
 * All requests use multipart/form-data encoding
 */
export class FourDevsClient implements FourDevsApi {
  private readonly endpoint = '/ferramentas_online.php';
  private readonly client: AxiosInstance;

  constructor() {
    this.client = createHttpClient();
  }

  /**
   * Convert request object to FormData
   */
  private createFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    }
    
    return formData;
  }

  /**
   * Make a POST request to the 4Devs API
   */
  private async post<T>(data: Record<string, any>, responseType: 'json' | 'text' = 'json'): Promise<T> {
    try {
      const formData = this.createFormData(data);
      
      // Native FormData: axios sets the multipart Content-Type and boundary itself
      const response = await this.client.post<T>(this.endpoint, formData, {
        responseType: responseType as any
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(formatApiError(error));
      }
      throw error;
    }
  }

  /**
   * Generate random person data
   */
  async gerarPessoa(params: Omit<GeradorPessoaRequest, 'acao'>): Promise<GeradorPessoaResponse> {
    console.error('[API] Generating person data...');
    const request: GeradorPessoaRequest = {
      acao: 'gerar_pessoa',
      ...params
    };
    return this.post<GeradorPessoaResponse>(request);
  }

  /**
   * Load cities by state
   */
  async carregarCidades(params: Omit<CarregarCidadesRequest, 'acao'>): Promise<CarregarCidadesResponse> {
    console.error('[API] Loading cities...');
    const request: CarregarCidadesRequest = {
      acao: 'carregar_cidades',
      ...params
    };
    return this.post<CarregarCidadesResponse>(request, 'text');
  }

  /**
   * Generate certificate number
   */
  async gerarCertidao(params: Omit<GeradorCertidaoRequest, 'acao'>): Promise<GeradorCertidaoResponse> {
    console.error('[API] Generating certificate...');
    const request: GeradorCertidaoRequest = {
      acao: 'gerador_certidao',
      ...params
    };
    return this.post<GeradorCertidaoResponse>(request, 'text');
  }

  /**
   * Generate CNH (driver's license) number
   */
  async gerarCnh(): Promise<GeradorCnhResponse> {
    console.error('[API] Generating CNH...');
    const request: GeradorCnhRequest = {
      acao: 'gerar_cnh'
    };
    return this.post<GeradorCnhResponse>(request, 'text');
  }

  /**
   * Generate PIS number
   */
  async gerarPis(params: Omit<GeradorPisRequest, 'acao'>): Promise<GeradorPisResponse> {
    console.error('[API] Generating PIS...');
    const request: GeradorPisRequest = {
      acao: 'gerar_pis',
      ...params
    };
    return this.post<GeradorPisResponse>(request, 'text');
  }

  /**
   * Generate voter registration number
   */
  async gerarTituloEleitor(params: Omit<GeradorTituloEleitorRequest, 'acao'>): Promise<GeradorTituloEleitorResponse> {
    console.error('[API] Generating voter registration...');
    const request: GeradorTituloEleitorRequest = {
      acao: 'gerar_titulo_eleitor',
      ...params
    };
    return this.post<GeradorTituloEleitorResponse>(request, 'text');
  }
}