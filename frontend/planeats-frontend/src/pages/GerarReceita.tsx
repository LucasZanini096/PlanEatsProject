import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';

export default function GerarReceita() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ingredientes: '',
    comentario: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Aqui você pode adicionar a lógica para gerar a receita
    console.log('Gerando receita com:', formData);
    
    // Redirecionar para a página de salvar receita
    navigate('/salvar-receita');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <AppHeader />

      <main className="p-8 max-w-[700px] mx-auto text-center">
        <h2 className="text-[2.5rem] font-bold mt-8 mb-12">
          Qual será a receita de hoje?
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 text-left"
        >
          {/* Campo de Ingredientes */}
          <div>
            <label
              htmlFor="ingredientes"
              className="block mb-3 font-semibold text-lg"
            >
              Ingredientes que serão utilizados
            </label>
            <div className="relative inline-block w-full">
              <select
                id="ingredientes"
                name="ingredientes"
                value={formData.ingredientes}
                onChange={handleChange}
                className="w-full p-4 border-2 border-[#333] rounded-[15px] bg-white text-base font-['Poppins',sans-serif] appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Selecione um ou mais ingredientes
                </option>
                <option value="maca">Maçã</option>
                <option value="banana">Banana</option>
                <option value="frango">Frango</option>
                <option value="arroz">Arroz</option>
              </select>
              <div className="absolute top-0 right-0 h-full flex items-center bg-[#FFB366] px-5 rounded-tr-[13px] rounded-br-[13px] pointer-events-none text-white text-[2rem]">
                ▾
              </div>
            </div>
          </div>

          {/* Campo de Comentário */}
          <div>
            <label
              htmlFor="comentario"
              className="block mb-3 font-semibold text-lg"
            >
              Comentário adicional sobre a receita
            </label>
            <textarea
              id="comentario"
              name="comentario"
              rows={8}
              value={formData.comentario}
              onChange={handleChange}
              className="w-full p-4 border-2 border-[#333] rounded-[15px] bg-white text-base font-['Poppins',sans-serif] box-border resize-y"
            />
          </div>

          {/* Botão Gerar Receita */}
          <button
            type="submit"
            className="bg-[#90EE90] text-[#333] p-4 rounded-[20px] border-2 border-[#333] text-xl font-bold cursor-pointer w-1/2 mx-auto mt-8 hover:bg-[#7CFC00] transition-colors"
          >
            Gerar receita
          </button>
        </form>
      </main>
    </div>
  );
}
