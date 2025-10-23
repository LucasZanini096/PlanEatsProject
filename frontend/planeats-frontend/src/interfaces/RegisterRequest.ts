export interface RegisterRequest {
  nome?: string;
  email: string;
  senha: string;
  [key: string]: unknown; // permite campos extras, caso o backend exija
}