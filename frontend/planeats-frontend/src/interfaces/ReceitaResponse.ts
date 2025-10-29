export interface ReceitaResponse {
  id: number;
  nome: string;
  descricao: string;
  modoPreparo: string;
  ingredientes: string[];
  tempoPreparo: number;
  custoAproximado: number;
  urlImagem?: string;
  dataCriacao: string;
}