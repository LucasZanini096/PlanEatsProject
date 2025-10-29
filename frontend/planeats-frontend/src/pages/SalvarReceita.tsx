import { useLocation, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import type { ReceitaResponse } from '../interfaces/ReceitaResponse';

export default function SalvarReceita() {
  const navigate = useNavigate();
  const location = useLocation();
  const receita = location.state?.receita as ReceitaResponse;

  if (!receita) {
    navigate('/gerar-receita');
    return null;
  }

  const handleDiscardRecipe = () => {
    navigate('/gerar-receita');
  };

  const handleSaveRecipe = () => {
    alert('Receita salva com sucesso!');
    navigate('/receitas');
  };

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <AppHeader />

      <main className="p-8 max-w-[800px] mx-auto">
        <h2 className="text-[2.5rem] font-bold text-center mt-4 mb-8">
          Receita: {receita.nome}
        </h2>

        {receita.urlImagem && (
          <img
            src={receita.urlImagem}
            alt={receita.nome}
            className="w-full rounded-[15px] mb-10"
          />
        )}

        <section className="mb-10">
          <h3 className="text-[1.8rem] font-bold mb-4 border-b-2 border-[#ccc] pb-2">
            Descrição
          </h3>
          <p className="text-base leading-relaxed">{receita.descricao}</p>
        </section>

        <section className="mb-10">
          <h3 className="text-[1.8rem] font-bold mb-4 border-b-2 border-[#ccc] pb-2">
            Modo de preparo
          </h3>
          <div className="text-base leading-relaxed whitespace-pre-line">
            {receita.modoPreparo}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-[1.8rem] font-bold mb-4 border-b-2 border-[#ccc] pb-2">
            Ingredientes
          </h3>
          <div className="grid grid-cols-2 gap-2 gap-x-8">
            {receita.ingredientes.map((ing, index) => (
              <p key={index} className="text-base">{ing}</p>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-[1.8rem] font-bold mb-4 border-b-2 border-[#ccc] pb-2">
            Informações
          </h3>
          <div className="flex justify-between font-semibold text-base">
            <span>Tempo de Preparo: {receita.tempoPreparo} minutos</span>
            <span>Custo aproximado: R$ {receita.custoAproximado.toFixed(2)}</span>
          </div>
        </section>

        <div className="flex justify-center gap-8 mt-12">
          <button
            onClick={handleDiscardRecipe}
            className="py-4 px-10 rounded-[20px] border-2 border-[#333] text-lg font-bold cursor-pointer bg-[#FF6347] text-white hover:bg-[#e5533d] transition-colors"
          >
            Descartar receita
          </button>
          <button
            onClick={handleSaveRecipe}
            className="py-4 px-10 rounded-[20px] border-2 border-[#333] text-lg font-bold cursor-pointer bg-[#90EE90] text-[#333] hover:bg-[#7CFC00] transition-colors"
          >
            Salvar receita
          </button>
        </div>
      </main>
    </div>
  );
}