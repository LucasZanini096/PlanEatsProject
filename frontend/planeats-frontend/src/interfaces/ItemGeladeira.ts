import type { Usuario } from './Usuario';
import type { Ingrediente } from './Ingrediente';

export interface ItemGeladeira {
  id?: number;
  usuario: Usuario;
  ingrediente: Ingrediente;
  quantidade: number;
}