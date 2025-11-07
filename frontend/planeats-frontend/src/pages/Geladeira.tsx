import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { geladeiraService } from '../services/geladeiraService';
import { ingredienteService } from '../services/ingredienteService';
import { authService } from '../services/authService'
import type { ItemGeladeira } from '../interfaces/ItemGeladeira'
import type { Ingrediente } from '../interfaces/Ingrediente';

export default function Geladeira() {
  const navigate = useNavigate();
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [ingredients, setIngredients] = useState<ItemGeladeira[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<Ingrediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  console.log(availableIngredients)
  console.log(isAddingNew)
  useEffect(() => {
    // Verificar autenticação
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    carregarDados();
    setIsAddingNew(true);
  }, [navigate]);

  const carregarDados = async () => {
    try {
      setError('');
      const [geladeira, listaIngredientes] = await Promise.all([
        geladeiraService.minhaGeladeira(),
        ingredienteService.listarIngredientes(),
      ]);
      
      setIngredients(geladeira);
      setAvailableIngredients(listaIngredientes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
      console.error('Erro ao carregar dados:', err);
      
      // Se for erro de autenticação, redirecionar para login
      if (errorMessage.includes('401') || errorMessage.includes('403')) {
        authService.clearToken();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewIngredient = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!ingredientName.trim()) {
      setError('Nome do ingrediente é obrigatório');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      // Criar novo ingrediente no sistema
      const novoIngrediente = await ingredienteService.criarIngrediente(ingredientName);

      // Adicionar o ingrediente à geladeira
      await geladeiraService.adicionarIngrediente({
        ingredienteId: novoIngrediente.id!,
        quantidade: quantity,
      });
      
      // Recarregar dados
      await carregarDados();
      
      // Limpar formulário
      setIngredientName('');
      setQuantity(1);
      setIsAddingNew(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar ingrediente';
      setError(errorMessage);
      console.error('Erro ao adicionar ingrediente:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateIngredientQuantity = async (id: number, delta: number) => {
    try {
      setError('');
      
      if (delta > 0) {
        await geladeiraService.incrementarQuantidade(id);
      } else {
        await geladeiraService.decrementarQuantidade(id);
      }
      
      await carregarDados();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar quantidade';
      setError(errorMessage);
      console.error('Erro ao atualizar quantidade:', err);
    }
  };

  if (loading && ingredients.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0EAD6]">
        <AppHeader />
        <main className="p-8 max-w-[900px] mx-auto text-center">
          <p className="text-xl">Carregando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <AppHeader />

      <main className="p-8 max-w-[900px] mx-auto text-center">
        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-[15px] mb-6">
            {error}
          </div>
        )}

        {/* Seção Adicionar Ingrediente */}
        <section>
          <h2 className="text-[2rem] font-bold mt-4 mb-8">
            Adicionar ingrediente
          </h2>

          {/* Formulário para novo ingrediente */}
            <form
              onSubmit={handleAddNewIngredient}
              className="flex justify-center items-center flex-wrap gap-6 mb-12"
            >
              <div className="text-left">
                <label htmlFor="ingrediente-novo" className="block mb-2 font-semibold">
                  Nome do Ingrediente
                </label>
                <input
                  type="text"
                  id="ingrediente-novo"
                  value={ingredientName}
                  onChange={(e) => setIngredientName(e.target.value)}
                  className="p-3 border-2 border-[#333] rounded-[15px] bg-white text-base w-[250px]"
                  placeholder="Ex: Tomate"
                  disabled={loading}
                />
              </div>
              <div className="text-left">
                <label htmlFor="quantidade-novo" className="block mb-2 font-semibold">
                  Quantidade
                </label>
                <div className="flex items-center border-2 border-[#333] rounded-[15px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-[#FFB366] border-none text-[#333] text-xl font-bold py-3 px-4 cursor-pointer hover:bg-[#FF9933] transition-colors"
                    disabled={loading}
                  >
                    -
                  </button>
                  <span className="py-3 px-5 bg-white text-base font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-[#FFB366] border-none text-[#333] text-xl font-bold py-3 px-4 cursor-pointer hover:bg-[#FF9933] transition-colors"
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !ingredientName.trim()}
                className="bg-[#90EE90] text-[#333] py-3 px-8 rounded-[20px] border-2 border-[#333] text-base font-bold cursor-pointer self-end hover:bg-[#7CFC00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando...' : 'Criar e Adicionar'}
              </button>
            </form>
        </section>

        {/* Seção Meus Ingredientes */}
        <section>
          <h2 className="text-[2rem] font-bold mt-4 mb-8">Meus ingredientes</h2>
          
          {ingredients.length === 0 ? (
            <p className="text-gray-600 text-lg">
              Você ainda não tem ingredientes na sua geladeira.
            </p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
              {ingredients.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white p-2 px-4 border-2 border-[#333] rounded-[20px]"
                >
                  <div className="flex items-center gap-4 font-semibold">
                    <div className="w-[30px] h-[30px] bg-[#E0E0E0] rounded-full flex justify-center items-center">
                      <div className="w-[15px] h-[15px] bg-red-500 rounded-full"></div>
                    </div>
                    <span>
                      {item.quantidade} {item.ingrediente.nome}
                    </span>
                  </div>
                  <div className="flex items-center border-2 border-[#333] rounded-[15px] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateIngredientQuantity(item.id!, -1)}
                      className="bg-[#FFB366] border-none text-[#333] text-xl font-bold py-2 px-3 cursor-pointer hover:bg-[#FF9933] transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => updateIngredientQuantity(item.id!, 1)}
                      className="bg-[#FFB366] border-none text-[#333] text-xl font-bold py-2 px-3 cursor-pointer hover:bg-[#FF9933] transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}