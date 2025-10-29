import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { receitaService } from '../services/receitaService';
import { authService } from '../services/authService';
import type { ReceitaResponse } from '../interfaces/ReceitaResponse';
import hamburguerImg from '../assets/Hamburguer.png';

export default function DetalheReceita() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [receita, setReceita] = useState<ReceitaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    carregarReceita();
  }, [id]);

  const carregarReceita = async () => {
    if (!id) {
      navigate('/receitas');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const data = await receitaService.buscarReceita(Number(id));
      setReceita(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar receita';
      setError(errorMessage);
      console.error('Erro ao carregar receita:', err);
      
      if (errorMessage.includes('401') || errorMessage.includes('403')) {
        authService.clearToken();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!receita || !window.confirm('Tem certeza que deseja deletar esta receita?')) {
      return;
    }

    try {
      await receitaService.deletarReceita(receita.id);
      alert('Receita deletada com sucesso!');
      navigate('/receitas');
    } catch (error) {
      console.error('Erro ao deletar receita:', error);
      alert('Erro ao deletar receita. Tente novamente.');
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EAD6]">
        <AppHeader />
        <main className="p-8 max-w-[800px] mx-auto text-center">
          <p className="text-xl mt-20">Carregando receita...</p>
        </main>
      </div>
    );
  }

  if (error || !receita) {
    return (
      <div className="min-h-screen bg-[#F0EAD6]">
        <AppHeader />
        <main className="p-8 max-w-[800px] mx-auto text-center">
          <p className="text-xl text-red-600 mt-20">{error || 'Receita não encontrada'}</p>
          <button
            onClick={() => navigate('/receitas')}
            className="bg-[#90EE90] text-[#333] p-4 rounded-[20px] border-2 border-[#333] text-xl font-bold cursor-pointer mt-8 hover:bg-[#7CFC00] transition-colors"
          >
            Voltar para minhas receitas
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <AppHeader />

      <main className="p-8 max-w-[800px] mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/receitas')}
          className="flex items-center gap-2 text-[#333] mb-6 hover:text-[#555] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-lg font-semibold">Voltar</span>
        </button>

        {/* Título */}
        <h2 className="text-[2.5rem] font-bold text-center mt-4 mb-8">
          {receita.nome}
        </h2>

        {/* Imagem */}
        {receita.urlImagem && (
          <img
            src={receita.urlImagem}
            alt={receita.nome}
            className="w-full max-h-[400px] object-cover rounded-[15px] mb-10 border-2 border-[#333]"
            onError={(e) => {
              e.currentTarget.src = hamburguerImg;
            }}
          />
        )}

        {/* Informações Rápidas */}
        <div className="flex justify-around items-center bg-white border-2 border-[#333] rounded-[15px] p-6 mb-10">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Tempo de Preparo</p>
            <p className="text-2xl font-bold text-[#333]">{receita.tempoPreparo} min</p>
          </div>
          <div className="w-px h-12 bg-[#333]"></div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Custo Aproximado</p>
            <p className="text-2xl font-bold text-[#333]">
              R$ {receita.custoAproximado.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Descrição */}
        <section className="mb-10">
          <h3 className="text-[1.8rem] font-bold mb-4 border-b-2 border-[#ccc] pb-2">
            Descrição
          </h3>
          <p className="text-base leading-relaxed">{receita.descricao}</p>
        </section>

        {/* Ingredientes */}
        <section className="mb-10">
          <h3 className="text-[1.8rem] font-bold mb-4 border-b-2 border-[#ccc] pb-2">
            Ingredientes
          </h3>
          <div className="bg-white border-2 border-[#333] rounded-[15px] p-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {receita.ingredientes.map((ingrediente, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#90EE90] text-xl">•</span>
                  <span className="text-base">{ingrediente}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Modo de Preparo */}
        <section className="mb-10">
          <h3 className="text-[1.8rem] font-bold mb-4 border-b-2 border-[#ccc] pb-2">
            Modo de Preparo
          </h3>
          <div className="bg-white border-2 border-[#333] rounded-[15px] p-6">
            <div className="text-base leading-relaxed whitespace-pre-line">
              {receita.modoPreparo}
            </div>
          </div>
        </section>

        {/* Data de Criação */}
        <div className="text-center text-sm text-gray-600 mb-8">
          Criada em {formatarData(receita.dataCriacao)}
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-center gap-8 mt-12 mb-8">
          <button
            onClick={handleDelete}
            className="py-4 px-10 rounded-[20px] border-2 border-[#333] text-lg font-bold cursor-pointer bg-[#FF6347] text-white hover:bg-[#e5533d] transition-colors"
          >
            Deletar receita
          </button>
          <button
            onClick={() => navigate('/receitas')}
            className="py-4 px-10 rounded-[20px] border-2 border-[#333] text-lg font-bold cursor-pointer bg-[#90EE90] text-[#333] hover:bg-[#7CFC00] transition-colors"
          >
            Voltar para receitas
          </button>
        </div>
      </main>
    </div>
  );
}