import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmeSenha: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validação básica
    if (formData.senha !== formData.confirmeSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    
    // Aqui você pode adicionar a lógica de cadastro
    console.log('Dados do formulário:', formData);
    
    // Redirecionar para a página de geladeira
    navigate('/geladeira');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return(
    <>
      <form onSubmit={handleSubmit} className="text-left">
        <label
          htmlFor="nome"
          className="block mb-2 font-semibold text-[#333]"
        >
          Nome
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          className="w-full p-3 mb-6 border-2 border-[#333] rounded-[15px] bg-[#E0E0E0] text-base box-border"
        />

        <label
          htmlFor="email"
          className="block mb-2 font-semibold text-[#333]"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-6 border-2 border-[#333] rounded-[15px] bg-[#E0E0E0] text-base box-border"
        />

        <label
          htmlFor="senha"
          className="block mb-2 font-semibold text-[#333]"
        >
          Senha
        </label>
        <input
          type="password"
          id="senha"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          required
          className="w-full p-3 mb-6 border-2 border-[#333] rounded-[15px] bg-[#E0E0E0] text-base box-border"
        />

        <label
          htmlFor="confirmeSenha"
          className="block mb-2 font-semibold text-[#333]"
        >
          Confirme sua senha
        </label>
        <input
          type="password"
          id="confirmeSenha"
          name="confirmeSenha"
          value={formData.confirmeSenha}
          onChange={handleChange}
          required
          className="w-full p-3 mb-6 border-2 border-[#333] rounded-[15px] bg-[#E0E0E0] text-base box-border"
        />

        {/* Grupo de Botões */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-1/2 p-3 rounded-[20px] border-2 border-[#333] text-lg font-bold cursor-pointer bg-[#90EE90] text-[#333] hover:bg-[#7CFC00] transition-colors duration-300"
          >
            VOLTAR
          </button>
          <button
            type="submit"
            className="w-1/2 p-3 rounded-[20px] border-2 border-[#333] text-lg font-bold cursor-pointer bg-[#007BFF] text-white hover:bg-[#0056b3] transition-colors duration-300"
          >
            CRIAR CONTA
          </button>
        </div>
      </form>
    
    </>
  )
  
}