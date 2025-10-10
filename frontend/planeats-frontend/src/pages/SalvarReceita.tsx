import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import hamburguerImg from '../assets/Hamburguer.png';

export default function SalvarReceita() {
  const navigate = useNavigate();

  const handleSaveRecipe = () => {
    // Adicione aqui a lógica para salvar a receita
    console.log('Receita salva!');
    navigate('/receitas');
  };

  const handleDiscardRecipe = () => {
    navigate('/receitas');
  };

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <AppHeader />

      <main className="p-8 max-w-[800px] mx-auto">
        {/* Título da Receita */}
        <h2 className="text-[2.5rem] font-bold text-center mt-4 mb-8">
          Receita: Hamburguer Fitness
        </h2>

        {/* Imagem da Receita */}
        <img
          src={hamburguerImg}
          alt="Foto de um hamburguer fitness"
          className="w-full rounded-[15px] mb-10"
        />

        {/* Seção Descrição */}
        <section className="mb-10">
          <h3 className="text-[1.8rem] font-bold mb-4 border-b-2 border-[#ccc] pb-2">
            Descrição
          </h3>
          <p className="text-base leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit Ut et massa
            mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien
            fringilla, mattis ligula consectetur, ultrices mauris. Maecenas
            vitae mattis tellus. Nulla quis imperdiet augue. Vestibulum
            ultricies leo, non suscipit magna interdum eu.
          </p>
        </section>

        {/* Seção Modo de Preparo */}
        <section className="mb-10">
          <h3 className="text-[1.8rem] font-bold mb-4 border-b-2 border-[#ccc] pb-2">
            Modo de preparo
          </h3>
          <ol className="pl-5 text-base leading-relaxed">
            <li className="mb-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit Ut et
              massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien
              fringilla, mattis ligula consectetur, ultrices mauris.
            </li>
            <li className="mb-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit Ut et
              massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien
              fringilla, mattis ligula consectetur, ultrices mauris.
            </li>
            <li className="mb-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit Ut et
              massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien
              fringilla, mattis ligula consectetur, ultrices mauris.
            </li>
            <li className="mb-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit Ut et
              massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien
              fringilla, mattis ligula consectetur, ultrices mauris.
            </li>
          </ol>
        </section>

        {/* Seção Ingredientes */}
        <section className="mb-10">
          <h3 className="text-[1.8rem] font-bold mb-4 border-b-2 border-[#ccc] pb-2">
            Ingredientes
          </h3>
          <div className="grid grid-cols-2 gap-2 gap-x-8">
            <p className="text-base">3 - Lorem Ipsum</p>
            <p className="text-base">2 - Lorem Ipsum</p>
            <p className="text-base">3 - Lorem Ipsum</p>
            <p className="text-base">1 - Lorem Ipsum</p>
          </div>
        </section>

        {/* Seção Informações */}
        <section className="mb-10">
          <h3 className="text-[1.8rem] font-bold mb-4 border-b-2 border-[#ccc] pb-2">
            Informações
          </h3>
          <div className="flex justify-between font-semibold text-base">
            <span>Tempo de Preparo: 30 minutos</span>
            <span>Custo aproximado ( R$ ): 60,00</span>
          </div>
        </section>

        {/* Botões de Ação */}
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
