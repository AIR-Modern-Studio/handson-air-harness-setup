// Request types based on 4Devs OpenAPI specification
export interface GeradorPessoaRequest {
  acao: 'gerar_pessoa';
  sexo: 'H' | 'M' | 'I';
  pontuacao?: 'S' | 'N';
  idade?: number;
  cep_estado?: string;
  txt_qtde: number;
  cep_cidade?: number;
}

export interface CarregarCidadesRequest {
  acao: 'carregar_cidades';
  cep_estado: string;
}

export interface GeradorCertidaoRequest {
  acao: 'gerador_certidao';
  pontuacao?: 'S' | 'N';
  tipo_certidao?: 'nascimento' | 'casamento' | 'casamento_religioso' | 'obito' | 'Indiferente';
}

export interface GeradorCnhRequest {
  acao: 'gerar_cnh';
}

export interface GeradorPisRequest {
  acao: 'gerar_pis';
  pontuacao?: 'S' | 'N';
}

export interface GeradorTituloEleitorRequest {
  acao: 'gerar_titulo_eleitor';
  estado?: string;
}

// Response types based on 4Devs OpenAPI specification
export interface Pessoa {
  nome: string;
  idade: number;
  cpf: string;
  rg: string;
  data_nasc: string;
  sexo: string;
  signo: string;
  mae: string;
  pai: string;
  email: string;
  senha: string;
  cep: string;
  endereco: string;
  numero: number;
  bairro: string;
  cidade: string;
  estado: string;
  telefone_fixo: string;
  celular: string;
  altura: string;
  peso: number;
  tipo_sanguineo: string;
  cor: string;
}

export type GeradorPessoaResponse = Pessoa[];
export type CarregarCidadesResponse = string; // HTML string with <option> tags
export type GeradorCertidaoResponse = string; // Plain text certificate number
export type GeradorCnhResponse = string; // Plain text CNH number
export type GeradorPisResponse = string; // Plain text PIS number
export type GeradorTituloEleitorResponse = string; // Plain text voter registration number