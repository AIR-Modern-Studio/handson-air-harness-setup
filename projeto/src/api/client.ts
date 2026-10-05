import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import https from 'https';
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
  GeradorTituloEleitorResponse
} from './types.js';

/**
 * Client for interacting with the 4Devs API
 * All requests use multipart/form-data encoding
 */
export class FourDevsClient {
  private readonly baseURL = 'https://www.4devs.com.br';
  private readonly endpoint = '/ferramentas_online.php';
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'User-Agent': '4devs-mcp-server/1.0.0'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // Allow self-signed certificates
      })
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
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
    this.client.interceptors.response.use(
      (response) => {
        console.error(`[API] Response status: ${response.status}`);
        return response;
      },
      (error) => {
        console.error('[API] Response error:', error.message);
        return Promise.reject(error);
      }
    );
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
      
      const response = await this.client.post<T>(this.endpoint, formData, {
        headers: {
          ...formData.getHeaders()
        },
        responseType: responseType as any
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data || error.message;
        throw new Error(`4Devs API error: ${message}`);
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
    return this.post<CarregarCidadesResponse>(request);
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