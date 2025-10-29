import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { geladeiraService } from '../services/geladeiraService';
import { receitaService } from '../services/receitaService';
import { authService } from '../services/authService';
import type { ItemGeladeira } from '../interfaces/ItemGeladeira';

export default function GerarReceita() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<ItemGeladeira[]>([]);
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setError('');
      setLoading(true);
      const geladeira = await geladeiraService.minhaGeladeira();
      setIngredients(geladeira);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
      console.error('Erro ao carregar dados:', err);
      
      if (errorMessage.includes('401') || errorMessage.includes('403')) {
        authService.clearToken();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIngredienteChange = (id: number) => {
    setIngredientesSelecionados(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (ingredientesSelecionados.length === 0) {
      alert('Selecione pelo menos um ingrediente');
      return;
    }

    setLoading(true);

    try {
      const receita = await receitaService.gerarReceita({
        ingredientesIds: ingredientesSelecionados,
        comentario
      });

      navigate('/salvar-receita', { state: { receita } });
    } catch (error) {
      console.error('Erro ao gerar receita:', error);
      alert('Erro ao gerar receita. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && ingredients.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0EAD6]">
        <AppHeader />
        <main className="p-8 max-w-[700px] mx-auto text-center">
          <p className="text-xl mt-20">Carregando...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F0EAD6]">
        <AppHeader />
        <main className="p-8 max-w-[700px] mx-auto text-center">
          <p className="text-xl text-red-600 mt-20">{error}</p>
        </main>
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0EAD6]">
        <AppHeader />
        <main className="p-8 max-w-[700px] mx-auto text-center">
          <h2 className="text-[2.5rem] font-bold mt-8 mb-12">
            Qual será a receita de hoje?
          </h2>
          <p className="text-xl">Você não tem ingredientes na geladeira.</p>
          <button
            onClick={() => navigate('/geladeira')}
            className="bg-[#90EE90] text-[#333] p-4 rounded-[20px] border-2 border-[#333] text-xl font-bold cursor-pointer mt-8 hover:bg-[#7CFC00] transition-colors"
          >
            Adicionar ingredientes
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <AppHeader />

      <main className="p-8 max-w-[700px] mx-auto text-center">
        <h2 className="text-[2.5rem] font-bold mt-8 mb-12">
          Qual será a receita de hoje?
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-left">
          <div>
            <label className="block mb-3 font-semibold text-lg">
              Ingredientes que serão utilizados
            </label>
            <div className="border-2 border-[#333] rounded-[15px] p-4 bg-white max-h-60 overflow-y-auto">
              {ingredients.map(item => (
                <label key={item.id} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={ingredientesSelecionados.includes(item.id)}
                    onChange={() => handleIngredienteChange(item.id)}
                    className="w-5 h-5"
                  />
                  <span>{item.ingrediente.nome}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comentario" className="block mb-3 font-semibold text-lg">
              Comentário adicional sobre a receita
            </label>
            <textarea
              id="comentario"
              rows={8}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Ex: Prefiro receitas mais saudáveis, sem fritura..."
              className="w-full p-4 border-2 border-[#333] rounded-[15px] bg-white text-base font-['Poppins',sans-serif] box-border resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#90EE90] text-[#333] p-4 rounded-[20px] border-2 border-[#333] text-xl font-bold cursor-pointer w-1/2 mx-auto mt-8 hover:bg-[#7CFC00] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Gerando...' : 'Gerar receita'}
          </button>
        </form>
      </main>
    </div>
  );
}