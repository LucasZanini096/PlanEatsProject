import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import RecipeCard from '../components/RecipeCard';
import { receitaService } from '../services/receitaService';
import { authService } from '../services/authService';
import type { ReceitaResponse } from '../interfaces/ReceitaResponse';

export default function Receitas() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<ReceitaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    carregarReceitas();
  }, []);

  const carregarReceitas = async () => {
    try {
      setError('');
      setLoading(true);
      const receitas = await receitaService.listarMinhasReceitas();
      setRecipes(receitas);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar receitas';
      setError(errorMessage);
      console.error('Erro ao carregar receitas:', err);
      
      if (errorMessage.includes('401') || errorMessage.includes('403')) {
        authService.clearToken();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Tem certeza que deseja deletar esta receita?')) {
      return;
    }

    try {
      await receitaService.deletarReceita(id);
      setRecipes(recipes.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error('Erro ao deletar receita:', error);
      alert('Erro ao deletar receita. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EAD6]">
        <AppHeader />
        <main className="p-8 max-w-[800px] mx-auto text-center">
          <p className="text-xl mt-20">Carregando receitas...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F0EAD6]">
        <AppHeader />
        <main className="p-8 max-w-[800px] mx-auto text-center">
          <p className="text-xl text-red-600 mt-20">{error}</p>
          <button
            onClick={carregarReceitas}
            className="bg-[#90EE90] text-[#333] p-4 rounded-[20px] border-2 border-[#333] text-xl font-bold cursor-pointer mt-8 hover:bg-[#7CFC00] transition-colors"
          >
            Tentar novamente
          </button>
        </main>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0EAD6]">
        <AppHeader />
        <main className="p-8 max-w-[800px] mx-auto text-center">
          <h2 className="text-[2.5rem] font-bold mt-4 mb-12">Minhas receitas</h2>
          <p className="text-xl mb-8">Você ainda não tem receitas salvas.</p>
          <button
            onClick={() => navigate('/gerar-receita')}
            className="bg-[#90EE90] text-[#333] p-4 rounded-[20px] border-2 border-[#333] text-xl font-bold cursor-pointer hover:bg-[#7CFC00] transition-colors"
          >
            Criar primeira receita
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <AppHeader />

      <main className="p-8 max-w-[800px] mx-auto text-center">
        <h2 className="text-[2.5rem] font-bold mt-4 mb-12">Minhas receitas</h2>

        <div className="flex flex-col gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              name={recipe.nome}
              image={recipe.urlImagem}
              onDelete={handleDeleteRecipe}
            />
          ))}
        </div>
      </main>
    </div>
  );
}